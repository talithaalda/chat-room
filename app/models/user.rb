class User < ApplicationRecord
  validates :name, presence: true
  has_many :messages, dependent: :destroy
end
