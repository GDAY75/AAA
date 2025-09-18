Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  resources :members, param: :slug, only: [:show, :index]
  resources :pieces, only: [:index, :show]
  get  "contact", to: "contacts#new"
  post "contact", to: "contacts#create"
end
