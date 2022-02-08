class Api::ProjectsController < ApplicationController
  before_action :authenticate_user!

  def index
    @projects = Project.joins(:memberships).where('memberships.user_id = (?) AND invitation_accepted = true', current_user.id).order(created_at: :desc)

    render :index
  end

  def create
    ActiveRecord::Base.transaction do
      old_active_membership = Membership.where("user_id = (?) AND active = true", current_user.id).first

      @project = Project.new(project_params)

      if @project.save
        if (old_active_membership)
          old_active_membership.update!(active: false)
        end
        
        @project.memberships.create!(project_id: @project.id, user_id: current_user.id, role: Role.find(1), invitation_accepted: true, active: true)
        @project.sprints.create!(project_id: @project.id, due_datetime: 14.days.from_now,name: "Sprint 1", start_datetime: Time.zone.now, active: true, closed: false)
        create_categories
        render @project
      else
        render json: {error: 'Unable to create project'}
      end
    end
  end

  private

  def project_params
    params.require(:project).permit(:title, :description)
  end

  def create_categories
    @project.task_categories.create!(title: "Backend", project_id: @project.id)
    @project.task_categories.create!(title: "Frontend", project_id: @project.id)
  end
  
end
