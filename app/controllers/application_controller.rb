class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  respond_to :json
  
  def after_sign_out_path_for(*)
    new_user_session_path
  end
end
