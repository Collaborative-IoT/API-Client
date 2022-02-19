import WebSocket from "isomorphic-ws";
import { AllUsersInRoomResponse, AuthCredentials, BasicResponse, CommunicationRoom, DeafAndMuteStatusUpdate, RoomPermissions } from "./entities";
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
        this.socket.onopen = (e) =>{
            this.socket.send(string_auth);
        }
        this.socket.onmessage = (e) =>{
            this.route(e);
        }
    }

    /**
     * Route incomming messages to the client subscriber defined
     * functionality
     */
     route(e:WebSocket.MessageEvent){
        let basic_response:BasicResponse = JSON.parse(e.data.toString());
        switch(basic_response.response_op_code){
            case "room_permissions":{
                if (this.client_sub.all_room_permissions){
                    this.client_sub.all_room_permissions(JSON.parse(basic_response.response_containing_data));
                }
            }

            case "user_mute_and_deaf_update":{
                if (this.client_sub.deaf_and_mute_update){
                    this.client_sub.deaf_and_mute_update(JSON.parse(basic_response.response_containing_data));
                }
            }

            case "@send-track-recv-done":{
                if (this.client_sub.send_track_recv_done){
                    this.client_sub.send_track_recv_done(JSON.parse(basic_response.response_containing_data));
                }
            }

            case "@send-track-send-done":{
                if (this.client_sub.send_track_send_done){
                    this.client_sub.send_track_send_done(JSON.parse(basic_response.response_containing_data));
                }
            }

            case "@connect-transport-recv-done":{
                if (this.client_sub.connect_transport_recv_done){
                    this.client_sub.connect_transport_recv_done(JSON.parse(basic_response.response_containing_data));
                }
            }

            case "@connect-transport-send-done":{
                if (this.client_sub.connect_transport_send_done){
                    this.client_sub.connect_transport_send_done(JSON.parse(basic_response.response_containing_data));
                }
            }

            case "invalid_request":{
                if (this.client_sub.invalid_request){
                    this.client_sub.invalid_request(basic_response.response_containing_data);
                }
            }
        }
     }
}

/**
 * All of the possible subscriptions to server events
 * this class is suppose to be directly consumed by the Client
 */
export class ClientSubscriber{
    /**
     * When authentication fails
     */
    public bad_auth:Nullable<Handler<any>> = null;
    /**
     * When a request isn't correctly formatted
     */
    public invalid_request:Nullable<Handler<string>> = null;
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
     * When the server notifies you that a user updated their
     * mute/deaf status
     */
    public deaf_and_mute_update:Nullable<Handler<DeafAndMuteStatusUpdate>> = null;
    /**
     * When the server sends you all of the permissions for the
     * users in your room
     */
    public all_room_permissions:Nullable<Handler<Map<number,RoomPermissions>>> = null;
    /**
     * When the server sends you all of the top rooms
     */
    public top_rooms:Nullable<Handler<CommunicationRoom>> = null;
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
}