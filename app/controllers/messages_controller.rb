class MessagesController < ApplicationController
  before_action :set_message, only: %i[ show update destroy ]

  # GET /messages
  def index
    @messages = Message.includes(:user).all
    render json: @messages.as_json(include: { user: { only: [ :id, :name ] } })
  end

  # GET /messages/1
  def show
    render json: @message
  end

  # POST /messages
  def create
    @message = Message.new(message_params)

    if @message.save
      render json: @message, status: :created, location: @message
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /messages/1
  def update
    if @message.update(message_params)
      render json: @message
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end

   # DELETE /messages/1
   def destroy
    @message = Message.find(params[:id])
    if @message.destroy
      ActionCable.server.broadcast("MessagesChannel", {
        type: "delete_confirmation",
        messageId: @message.id
      })
      head :no_content
    else
      render json: { error: "Failed to delete message" }, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def message_params
      params.require(:message).permit(:body, :user_id)
    end
end