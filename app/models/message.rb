class Message < ApplicationRecord
  belongs_to :user
  after_create_commit :broadcast_message

  private

  def broadcast_message
    ActionCable.server.broadcast("MessagesChannel", {
      id: id,
      body: body,
      user: {
        id: user.id,
        name: user.name
      }
    })
  end
end
