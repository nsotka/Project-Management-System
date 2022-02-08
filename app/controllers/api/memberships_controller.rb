class Api::MembershipsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_membership, only: [:destroy]

  def add_members
    @members = params[:members]

    members_saved = []

    @members.each do |member|
      foundUser = User.find_by(email: member[:email])

      if foundUser
        member_params = ActionController::Parameters.new(membership: { project_id: member[:project_id], role_id: member[:role_id], user_id: foundUser.id})
        permitted = member_params.require(:membership).permit(:project_id, :role_id, :user_id)
        
        new_member = Membership.new(permitted)

        if new_member.save
          members_saved.push(new_member)
        end
      end
    end

    render json: {members_saved: members_saved}
  end

  def accept_invitation
    @membership = Membership.find(params[:membership_id])
    
    if @membership.user_id === current_user.id
      if @membership.update(:invitation_accepted => true)
        render :accept_invitation
      else
        render json: {error: 'Invitation accept failed'}
      end
    end
  end

  def deny_invitation
    @membership = Membership.find(params[:membership_id])

    if @membership.user_id === current_user.id
      if @membership.destroy
        render @membership
      else
        render json: {error: "Invitation couldn't be denied"}
      end
    end
  end

  def change_active_project
    old_project = Membership.where("user_id = (?) AND active=true", current_user.id).first
    new_project = Membership.where("project_id = (?) AND user_id = (?)", params[:project_id], current_user.id).first

    if update_active_status(old_project, new_project)
      render json: {old_project: old_project, new_project: new_project}
    else
      render json: {error: "ei toimi"}
    end
  end

  def destroy
    if @membership.destroy
      render @membership
    else
      render json: {error: "Couldn't delete invitation"}
    end
  end

  private

  def set_membership
    @membership = Membership.find(params[:id])
  end

  def membership_params
    params.require(:memberships).permit(:members => [])
  end

  def update_active_status(old_project, new_project)
    ActiveRecord::Base.transaction do
      old_project.update!(active: false)
      new_project.update!(active: true)
    end
  end

end
