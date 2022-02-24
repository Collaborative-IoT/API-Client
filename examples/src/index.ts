 
import {Client,AuthCredentials,ClientSubscriber} from "@collaborative/arthur";

const main = async ()=>{

    let auth_credentials: AuthCredentials = {
        access:process.env.ACCESS as string,
        refresh:process.env.REFRESH as string,
        oauth_type:"discord"
    };

    let subscriber = new ClientSubscriber();
    let example_client = new Client("ws://127.0.0.1:3030",subscriber, auth_credentials);
    example_client.begin();
}

main(); 