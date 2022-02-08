class Api::RolesController < ApplicationController
  before_action :authenticate_user!

  def index
    @roles = Role.all

    render :index
  end
end
