use hdk3::prelude::*;

#[hdk_entry(id = "foo", visibility = "public" )]
#[derive(Clone)]
struct Foo (String);

#[derive(Deserialize, Serialize, SerializedBytes)]
struct StringWrapper(String);

entry_defs![
    Path::entry_def(),
    Foo::entry_def()
];

#[hdk_extern]
fn create_foo(_: ()) -> ExternResult<Foo> {
    let foo = Foo("test".to_owned());
    create_entry!(foo.clone())?;
    let path = Path::from("bar".to_owned());
    path.ensure()?;
    create_link!(
        hash_entry!(path)?,
        hash_entry!(foo.clone())?,
        LinkTag::new("testing".to_owned())
    )?;
    Ok(foo)
}

#[hdk_extern]
fn get_author_of_foo(input: StringWrapper) -> ExternResult<AgentPubKey> {
    let path = Path::from(input.0);
    let path_hash = hash_entry!(path.clone())?;
    let links = get_links!(hash_entry!(path)?)?;
    debug!("links are {:#?}", links)?;
    debug!("hash of the path is {:#?}", path_hash)?;
    let link = links.into_inner()[0].clone();
    match get!(link.target)? {
        Some(element) => {
            let header_details = element.header();
            Ok(header_details.author().to_owned())
        },
        _ => Err(HdkError::Wasm(WasmError::Zome(String::from(
            "element not found"
        ))))
    }
}