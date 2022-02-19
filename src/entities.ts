export type User = {
  you_are_following: boolean,
  username: string,
  they_blocked_you: boolean,
  num_following: number,
  num_followers: number,
  last_online: string,
  user_id: number,
  follows_you: boolean,
  contributions: number,
  display_name: string,
  bio: string,
  avatar_url: string,
  banner_url: string,
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
  name:string,
  chat_throttle:number,
  is_private:boolean,
  description:string
}

export type UserPreview = {
  display_name: string,
  avatar_url: string
}

export type CommunicationRoom = {
  details:RoomDetails,
  room_id:number,
  num_of_people_in_room:number,
  voice_server_id:string,
  creator_id:number,
  people_preview_data:Map<number, UserPreview>,
  auto_speaker_setting:boolean,
  created_at:string,
  chat_mode:string,
}

export type BasicRoomCreation = {
  name:string,
  desc:string,
  public:boolean
}

export type AuthCredentials = {
  access:string,
  refresh:string,
  oauth_type:string
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

export type BasicResponse = {
  response_op_code:string,
  response_containing_data:string
}

export type BasicRequest = {
  request_op_code:string,
  request_containing_data:string
}