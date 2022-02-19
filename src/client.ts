import WebSocket from "isomorphic-ws";
import { AllUsersInRoomResponse, CommunicationRoom, RoomPermissions } from "./entities";
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
    public ClientSub: ClientSubscriber
    constructor(address:string, clientsub:ClientSubscriber){
        this.socket = new WebSocket(address,undefined);
        this.ClientSub = clientsub;
    }
}

/**
 * All of the possible subscriptions to server events
 * this class is suppose to be directly consumed by the Client
 */
export class ClientSubscriber{
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