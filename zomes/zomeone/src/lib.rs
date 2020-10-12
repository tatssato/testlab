use hdk3::prelude::*;

#[derive(Deserialize, Serialize, SerializedBytes)]
#[derive(Clone)]
enum Bat {
    Foo,
    Bar(String),
    Baz
}

// used for testing the links in call_remote
#[hdk_entry(id = "foo", visibility = "public" )]
#[derive(Clone, Debug)]
struct Foo (String);

// used for testing enum in entries
#[hdk_entry(id = "bar", visibility = "public" )]
#[derive(Clone)]
struct Bar {
    foo: bool
}

// used for testing linking private entries
#[hdk_entry(id = "foofoo", visibility = "public" )]
#[derive(Clone, Debug)]
struct FooFoo (String);

// used for testing linking private entries
#[hdk_entry(id = "barbar", visibility = "public" )]
#[derive(Clone, Debug)]
struct BarBar (String);

#[derive(Deserialize, Serialize, SerializedBytes)]
struct StringWrapper(String);

entry_defs![
    Path::entry_def(),
    Foo::entry_def(),
    Bar::entry_def(),
    FooFoo::entry_def(),
    BarBar::entry_def()
];

#[hdk_extern]
fn create_bar(_: ()) -> ExternResult<Bar> {
    let bar = Bar {
        foo: false
    };
    create_entry!(bar.clone())?;
    Ok(bar)
}

#[hdk_extern]
fn create_cap_grant(_: ()) -> ExternResult<()> {
    let mut functions: GrantedFunctions = HashSet::new();
    functions.insert((zome_info!()?.zome_name, "get_links_from_foo".into()));
    create_cap_grant!(
        CapGrantEntry {
            tag: "".into(),
            // empty access converts to unrestricted
            access: ().into(),
            functions,
        }
    )?;
    Ok(())
}

#[hdk_extern]
fn create_foo_and_link_to_path(_: ()) -> ExternResult<Foo> {
    let foo = Foo("foo".to_owned());
    create_entry!(&foo)?;
    let path = Path::from("bar".to_owned());
    path.ensure()?;
    create_link!(
        hash_entry!(&path)?,
        hash_entry!(&foo)?,
        LinkTag::new("foo->path".to_owned())
    )?;
    Ok(foo)
}

#[hdk_extern]
fn get_links_from_path(input: StringWrapper) -> ExternResult<Links> {
    let path = Path::from(input.0);
    let path_hash = hash_entry!(&path)?;
    let links = get_links!(path_hash.clone())?;
    debug!("links are {:#?}", links)?;
    debug!("hash of the path is {:#?}", path_hash)?;
    Ok(links)
}

#[hdk_extern]
fn create_and_link_foo(_: ()) -> ExternResult<()> {
    let base = Foo("foo".to_string());
    let target = Foo("foofoo".to_string());
    let base_hash = hash_entry!(&base)?;
    let target_hash = hash_entry!(&base)?;
    let tag = LinkTag::new("foos");
    create_entry!(&base)?;
    create_entry!(&target)?;
    create_link!(base_hash, target_hash, tag)?;
    Ok(())
}

#[hdk_extern]
fn get_links_from_foo(_: ()) -> ExternResult<Links> {
    let base = Foo("foo".to_owned());
    debug!("base for get_author_of_foo {:#?}", base.clone())?;
    let base_hash = hash_entry!(&base)?;
    debug!("base_hash for get_author_of_foo {:#?}", base_hash.clone())?;
    let links = get_links!(base_hash)?;
    debug!("links for get_author_of_foo {:#?}", links.clone())?;
    Ok(links)
}

#[hdk_extern]
fn caller(agent: AgentPubKey) -> ExternResult<Links> {
    let function_name = zome::FunctionName("get_links_from_foo".to_owned());

    match call_remote!(
        agent, 
        "zomeone".into(),
        function_name, 
        None,
        ().try_into()?
    )? {
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
fn create_foofoo_and_link(_: ()) -> ExternResult<FooFoo> {
    let foofoo = FooFoo("foofoo".to_owned());
    let barbar = BarBar("barbar".to_owned());
    let base_hash = hash_entry!(&foofoo)?;
    let target_hash = hash_entry!(&barbar)?;
    create_entry!(&foofoo)?;
    create_entry!(&barbar)?;
    create_link!(
        base_hash,
        target_hash,
        LinkTag::new("foofoo->barbar")
    )?;
    Ok(foofoo)
}

#[hdk_extern]
fn get_links_from_foofoo(_: ()) -> ExternResult<Links> {
    let foofoo = FooFoo("foofoo".to_owned()); 
    let base_hash = hash_entry!(&foofoo)?;
    let links = get_links!(base_hash)?;
    Ok(links)
}