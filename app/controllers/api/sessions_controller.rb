class Api::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
      render json: resource
    end
  def respond_to_on_destroy
      render json: {message: "logged out"}
  end
end
