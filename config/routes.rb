Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }
  devise_scope :user do
        get "api/me", to: "api/users#me"
        post "api/signup", to: "api/registrations#create"
        post "api/login", to: "api/sessions#create"
        delete "api/logout", to: "api/sessions#destroy"
  end

  namespace :api, defaults: {format: :json} do

    resources :projects do
      resources :sprints do
        put "/change_active_status", to: "sprints#change_active_status"
        put "/change_closed_status", to: "sprints#change_closed_status"
      end
    end

    resources :roles, only: [:index]

    resources :tasks do
      post "/move_task", to: "tasks#move_task"
      put "/change_status", to: "tasks#change_task_status"
    end

    resources :task_categories
    post "/task_categories/get_project_categories", to: "task_categories#get_project_categories"

    resources :task_statuses

    resources :memberships do
      put "/accept", to: "memberships#accept_invitation"
      put "/deny", to: "memberships#deny_invitation"
    end
    post "/memberships/change_active_project", to: "memberships#change_active_project"
    post "/memberships/add_members", to: "memberships#add_members"
  end
end
