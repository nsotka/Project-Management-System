class Api::TaskCategoriesController < ApplicationController
  before_action :authenticate_user!

  def get_project_categories
    @task_categories = TaskCategory.where('project_id = (?)', params[:project_id]).order(title: :asc)

    render :project_categories
  end
end
