class Api::TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  def create
    @task = Task.new(task_params)

    status = TaskStatus.find_by(status: "planned")
    @task.task_status = status

    if @task.save
      render @task
    else
      render json: {error: 'Unable to create task'}
    end
  end

  def update
    if @task.update(task_params)
      render @task
    else
      render json: {error: "Couldn't update task"}
    end
  end

  def destroy

    found_membership = Membership.where("user_id = (?) AND project_id = (?)", current_user.id, @task.task_category.project_id)

    if !found_membership.empty?
      @task.destroy
      render @task
    else
      render json: {error: "Not a member of the project"}
    end
  end

  def move_task
    @task = Task.find(params[:task_id])
    
    @task.sprint_id = params[:sprint_id]

    if @task.save!
      render @task
    else
      render json: {error: "Couldn't move task"}
    end
  end

  def change_task_status
    @task = Task.find(params[:task_id])
    status = TaskStatus.find_by(status: params[:status])
    @task.task_status = status

    if @task.save!
      render @task
    else
      render json: {error: "Couln't change task status"}
    end
  end

  private

  def task_params
    params.require(:task).permit(:title, :task_category_id, :sprint_id, :task_status_id, :due_datetime, user_ids: [])
  end

  def set_task
    @task = Task.find(params[:id])
  end

end
