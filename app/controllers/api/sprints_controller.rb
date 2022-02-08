class Api::SprintsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_sprint, only: [:show, :edit, :update, :destroy]

  def create
    @sprint = Sprint.new(sprint_params)

    @sprint.project = Project.find(params[:project_id])
    @sprint.active = false
    @sprint.closed = false

    if @sprint.save!
      render @sprint
    else
      render json: {error: 'Unable to create the sprint'}
    end
  end

  def update
    if @sprint.update(sprint_params)
      render @sprint
    else
      render json: {error: "Couldn't update the sprint"}
    end
  end

  def destroy
    found_membership = Membership.where("user_id = (?) AND project_id = (?)", current_user.id, @sprint.project_id).first

    if found_membership && found_membership.role.title === "Admin"
      @sprint.destroy
      render @sprint
    else
      render json: {error: "Not a member of the project"}
    end
  end

  def change_closed_status
    @sprint = Sprint.find(params[:sprint_id])

    @sprint.closed = !@sprint.closed

    if @sprint.update!(closed: @sprint.closed)
      render @sprint
    else
      if @sprint.closed
        render json: {error: "Couldn't close the sprint"}
      else
        render json: {error: "Couldn't open the sprint"}
      end
    end
  end

  def change_active_status
    @old_sprint = Sprint.where("project_id = (?) AND active = true", params[:project_id]).first
    @sprint = Sprint.find(params[:sprint_id])

    if update_active_status(@old_sprint, @sprint)
      render @sprint
    else
      render json: {error: "Couldn't update active status"}
    end

  end

  private

  def update_active_status(old_sprint, new_sprint)
    ActiveRecord::Base.transaction do
      old_sprint.update!(active: false)
      new_sprint.update!(active: true)
    end
  end

  def sprint_params
    params.require(:sprint).permit(:name, :description, :due_datetime, :start_datetime)
  end

  def set_sprint
    @sprint = Sprint.find(params[:id])
  end

end
