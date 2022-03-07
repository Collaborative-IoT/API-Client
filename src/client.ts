import WebSocket from "isomorphic-ws";
import { BaseUser, GetFollowListResponse, UserPreview, VoiceServerResponse } from ".";
import { 
    AuthResponse,AllUsersInRoomResponse, AuthCredentials, BasicRequest, 
    BasicResponse, CommunicationRoom, DeafAndMuteStatusUpdate, 
    RoomPermissions, RoomUpdate } from "./entities";
type StringifiedUserId = string;
type Handler<Data> = (data: Data) => void;
type Nullable<T> = T | null;

/**
 * The main client for the Collaborative-IoT server.
 * 
 * The user of this class needs to define an instance of 
 * the client subscriber and the client publisher
 * 
 */
export class Client{
    socket: WebSocket
    auth:AuthCredentials
    public client_sub: ClientSubscriber

    constructor(
        address:string, 
        client_sub:ClientSubscriber, 
        auth_credentials:AuthCredentials){
            this.socket = new WebSocket(address,undefined);
            this.client_sub = client_sub;
            this.auth = auth_credentials;   
    }

    /**
     * Starts the client
     */
    public begin(){
        let string_auth = JSON.stringify(this.auth);
        this.socket.onopen = (e:any) =>{
            this.socket.send(string_auth);
        }
        this.socket.onmessage = (e:any) =>{
            try{
                this.route_basic_response(e);
                this.route_voice_response(e);
            }
            catch(error){
                console.log(e);
            }
        }
        this.socket.onerror  = (e:any)=>{
            console.log(e);
        }
    }

    /**
     * Sends a "Basic Request" to the server
     * @param op 
     * @param data 
     */
    public send(op:string, data:any){
        let basic_request:BasicRequest = {
            request_op_code:op,
            request_containing_data:JSON.stringify(data)
        };
        this.socket.send(JSON.stringify(basic_request));
    }

    /**
    * Route incomming messages to the client subscriber defined
    * functionality
    */
    public route_voice_response(e:WebSocket.MessageEvent){
        try{
            let voice_response:VoiceServerResponse = JSON.parse(e.data.toString());
            switch(voice_response.op){
                case "@send-track-recv-done":{
                        if (this.client_sub.send_track_recv_done){
                            this.client_sub.send_track_recv_done(voice_response);
                        }
                        break
                    }
                case "@send-track-send-done":{
                    if (this.client_sub.send_track_send_done){
                        this.client_sub.send_track_send_done(voice_response);
                    }
                    break
                }
                case "@connect-transport-recv-done":{
                    if (this.client_sub.connect_transport_recv_done){
                        this.client_sub.connect_transport_recv_done(voice_response);
                    }
                    break
                }
                case "@connect-transport-send-done":{
                    if (this.client_sub.connect_transport_send_done){
                        this.client_sub.connect_transport_send_done(voice_response);
                    }
                    break
                }
                case "@get-recv-tracks-done":{
                    if(this.client_sub.get_recv_tracks_done){
                        this.client_sub.get_recv_tracks_done(voice_response);
                    }
                    break
                }
                case "room-created":{
                    if (this.client_sub.room_created){
                        this.client_sub.room_created(voice_response.d.roomId);
                    }
                }
                default:
                    console.log('general error:',voice_response);
                    break
            }
        }
        catch{}
    }   

    /**
     * Route incomming messages to the client subscriber defined
     * functionality
     */
     public route_basic_response(e:WebSocket.MessageEvent){
        try{
            let basic_response:BasicResponse = JSON.parse(e.data.toString());
            switch(basic_response.response_op_code){
                case "room_permissions":{
                    if (this.client_sub.all_room_permissions){
                        this.client_sub.all_room_permissions(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "user_mute_and_deaf_update":{
                    if (this.client_sub.deaf_and_mute_update){
                        this.client_sub.deaf_and_mute_update(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "invalid_request":{
                    if (this.client_sub.invalid_request){
                        this.client_sub.invalid_request(basic_response.response_containing_data);
                    }
                    break
                }
                case "user_hand_lowered":{
                    if (this.client_sub.user_hand_lowered){
                        this.client_sub.user_hand_lowered(basic_response.response_containing_data);
                    }
                    break
                }
                case "user_asking_to_speak":{
                    if (this.client_sub.user_hand_raised){
                        this.client_sub.user_hand_raised(basic_response.response_containing_data);
                    }
                    break
                }
                case "issue_creating_room"||"issue_blocking_user"||"issue_adding_speaker":{
                    if(this.client_sub.internal_error){
                        this.client_sub.internal_error(basic_response.response_containing_data);
                    }
                    break
                }
                case "room_meta_update":{
                    if (this.client_sub.room_update){
                        this.client_sub.room_update(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "auth-not-good":{
                    if (this.client_sub.bad_auth){
                        this.client_sub.bad_auth(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "auth-good":{
                    if (this.client_sub.good_auth){
                        this.client_sub.good_auth(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "top_rooms":{
                    if (this.client_sub.top_rooms){
                        this.client_sub.top_rooms(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "you-joined-as-speaker":{
                    if (this.client_sub.you_joined_as_speaker){
                        this.client_sub.you_joined_as_speaker(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "you-joined-as-peer":{
                    if(this.client_sub.you_joined_as_peer){
                        this.client_sub.you_joined_as_peer(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "you_left_room":{
                    if(this.client_sub.you_left_room){
                        this.client_sub.you_left_room(basic_response.response_containing_data);
                    }
                    break
                }
                case "new_user_joined":{
                    if(this.client_sub.new_user_joined){
                        this.client_sub.new_user_joined(basic_response.response_containing_data);
                    }
                    break
                }
                case "all_users_for_room":{
                    if(this.client_sub.all_users_in_room){
                        this.client_sub.all_users_in_room(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "speaker_removed":{
                    if(this.client_sub.speaker_removed){
                        this.client_sub.speaker_removed(basic_response.response_containing_data);
                    }
                    break
                }
                case "new_speaker":{
                    if(this.client_sub.new_speaker){
                        this.client_sub.new_speaker(basic_response.response_containing_data);
                    }
                    break
                }
                case "new-peer-speaker":{
                    if(this.client_sub.new_peer_speaker){
                        this.client_sub.new_peer_speaker(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "your_data":{
                    if(this.client_sub.your_data){
                        this.client_sub.your_data(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "follow_list_response":{
                    if(this.client_sub.followers){
                        this.client_sub.followers(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                case "user_previews":{
                    if(this.client_sub.user_previews){
                        this.client_sub.user_previews(JSON.parse(basic_response.response_containing_data));
                    }
                    break
                }
                default:
                    console.log('general error:',basic_response,basic_response.response_op_code == "top_rooms" || basic_response.response_containing_data == "your_data");
                    break
                }
        }
        catch{}
    }
}

/**
 * All of the possible subscriptions to server events
 * this class is suppose to be directly consumed by the Client
 */
export class ClientSubscriber{
    /**
     * When authentication succeeds
     */
    public good_auth:Nullable<Handler<AuthResponse>> = null;
    /**
     * When authentication fails
     */
    public bad_auth:Nullable<Handler<AuthResponse>> = null;
    /**
     * When a request isn't correctly formatted
     */
    public invalid_request:Nullable<Handler<string>> = null;
    /**
     * When the server sends a follow list
     */
    public followers:Nullable<Handler<GetFollowListResponse>> = null;
    /**
     * When a user raises their hand
     */
    public user_hand_raised:Nullable<Handler<StringifiedUserId>> = null;
    /**
     * When a user lowers their hand
     */
    public user_hand_lowered:Nullable<Handler<StringifiedUserId>> = null;
    /**
     * When the server sends you all of the users in a room
     */
    public all_users_in_room:Nullable<Handler<AllUsersInRoomResponse>> = null;
    /**
     * When the server notifies you that you are no longer a room
     */
    public you_left_room:Nullable<Handler<any>> = null;
    /**
     * When the server notifies you that you joined a room as
     * a peer
     */
    public you_joined_as_peer:Nullable<Handler<any>> = null;
    /**
     * When the server notifies you that you joined a room as
     * a speaker
     */
    public you_joined_as_speaker:Nullable<Handler<any>> = null;
    /**
     * When the server notifies you that there is a room settings
     * update
     */
    public room_update:Nullable<Handler<RoomUpdate>> = null;
    /**
     * When the server notifies you that a user updated their
     * mute/deaf status
     */
    public deaf_and_mute_update:Nullable<Handler<DeafAndMuteStatusUpdate>> = null;
    /**
     * When the server sends you your data
     */
    public your_data:Nullable<Handler<BaseUser>> = null;
    /**
     * When the server sends you all of the permissions for the
     * users in your room
     */
    public all_room_permissions:Nullable<Handler<Map<number,RoomPermissions>>> = null;
    /**
     * When the server sends you all of the top rooms
     */
    public top_rooms:Nullable<Handler<Array<CommunicationRoom>>> = null;
    /**
     * When the server encounters an internal error
     */
    public internal_error:Nullable<Handler<any>> = null;
    /**
     * When the server notifies you that a speaker is removed
     */
    public speaker_removed:Nullable<Handler<StringifiedUserId>> = null;
    /**
     * When the server notifies you that a new user has joined your room
     */
    public new_user_joined:Nullable<Handler<StringifiedUserId>> = null; 
    /**
     * When the server sends you user previews
     */
    public user_previews:Nullable<Handler<Map<number,UserPreview>>> = null;
    /**
     * When the server notifies you that there is a new speaker
     */
    public new_speaker:Nullable<Handler<StringifiedUserId>> = null;
    /**
     * When the server notifies you that your room creation was successful.
     */
    public room_created:Nullable<Handler<number>> = null;
    /**
     * When the server notifies you that there is a new peer speaker
     * 
     */
    public new_peer_speaker:Nullable<Handler<any>> = null;
    /**
     * WEBRTC related
     * 
     */
    public connect_transport_recv_done:Nullable<Handler<any>> = null;
     /**
     * WEBRTC related
     * 
     */
    public connect_transport_send_done:Nullable<Handler<any>> = null;
    /**
     * WEBRTC related
     * 
     */
    public send_track_recv_done:Nullable<Handler<any>> = null;
    /**
     * WEBRTC related
     * 
     */
    public send_track_send_done:Nullable<Handler<any>> = null;
    /**
     * WEBRTC related
     */
    public get_recv_tracks_done:Nullable<Handler<any>> = null;
}