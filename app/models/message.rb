class Message < ApplicationRecord
  belongs_to :user
  after_create_commit :broadcast_message

  private
  validates :body, presence: true
  def broadcast_message
    ActionCable.server.broadcast("MessagesChannel", {
      id: id,
      body: body,
      created_at: created_at,
      user: {
        id: user.id,
        name: user.name
      }
    })
  end
end
