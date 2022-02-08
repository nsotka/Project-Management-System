class Api::TaskStatusesController < ApplicationController
  before_action :authenticate_user!

  def index
    @task_statuses = TaskStatus.all

    render :index
  end
end
