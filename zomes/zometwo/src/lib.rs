use hdk3::prelude::*;

#[derive(Deserialize, Serialize, SerializedBytes)]
struct StringWrapper(String);

#[hdk_extern]
fn get_links_from_path_from_zomeone(_: ()) -> ExternResult<Links> {
    let my_agent_pubkey = agent_info!()?.agent_latest_pubkey;
    let function_name = zome::FunctionName("get_links_from_path".to_owned());
    let payload: SerializedBytes = StringWrapper("bar".to_owned()).try_into()?;

    match call_remote!(my_agent_pubkey, "zomeone".into(), function_name, None, payload)? {
        ZomeCallResponse::Ok(output) => {
            let sb = output.into_inner();
            let links: Links = sb.try_into()?;
            Ok(links)
        },
        ZomeCallResponse::Unauthorized => {
            Err(HdkError::Wasm(WasmError::Zome(
                "this agent has no proper authorization".to_owned()
            )))
        },
    }
}

#[hdk_extern]
fn get_links_from_foo_from_zomeone(_: ()) -> ExternResult<Links> {
    let my_agent_pubkey = agent_info!()?.agent_latest_pubkey;
    let function_name = zome::FunctionName("get_author_of_foo".to_owned());
    let payload: SerializedBytes = StringWrapper("foo".to_owned()).try_into()?;

    match call_remote!(my_agent_pubkey, "zomeone".into(), function_name, None, payload)? {
        ZomeCallResponse::Ok(output) => {
            let sb = output.into_inner();
            let links: Links = sb.try_into()?;
            Ok(links)
        },
        ZomeCallResponse::Unauthorized => {
            Err(HdkError::Wasm(WasmError::Zome(
                "this agent has no proper authorization".to_owned()
            )))
        },
    }
}