class Api::UsersController < ApplicationController

  def me
    if current_user
      @user = User.find(current_user.id)
      render @user
    else
      render json: {error: "User hasn't logged in"}
    end
  end
end
