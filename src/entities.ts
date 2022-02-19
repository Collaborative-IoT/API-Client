export type User = {
  you_are_following: boolean,
  username: String,
  they_blocked_you: boolean,
  num_following: number,
  num_followers: number,
  last_online: String,
  user_id: number,
  follows_you: boolean,
  contributions: number,
  display_name: String,
  bio: String,
  avatar_url: String,
  banner_url: String,
  i_blocked_them: boolean,
}

export type AllUsersInRoomResponse = {
  room_id:number,
  users:Array<User>
}

export type GetFollowListResponse = {
  user_ids:Array<number>,
  for_user:Number
}

export type RoomDetails = {
  name:String,
  chat_throttle:number,
  is_private:boolean,
  description:String
}

export type UserPreview = {
  display_name: String,
  avatar_url: String
}

export type CommunicationRoom = {
  details:RoomDetails,
  room_id:number,
  num_of_people_in_room:number,
  voice_server_id:String,
  creator_id:number,
  people_preview_data:Map<number, UserPreview>,
  auto_speaker_setting:boolean,
  created_at:String,
  chat_mode:String,
}

export type BasicRoomCreation = {
  name:String,
  desc:String,
  public:boolean
}

export type AuthCredentials = {
  access:String,
  refresh:String,
  oauth_type:String
}

export type RoomPermissions = {
  asked_to_speak:boolean,
  is_speaker:boolean,
  is_mod:boolean
}

export type DeafAndMuteStatus = {
  muted:boolean,
  deaf:boolean
}

export type DeafAndMuteStatusUpdate = {
  muted:boolean,
  deaf:boolean,
  user_id:boolean
}