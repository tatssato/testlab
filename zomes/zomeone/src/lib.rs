use hdk3::prelude::*;

#[derive(Deserialize, Serialize, SerializedBytes)]
#[derive(Clone)]
enum Bat {
    Foo,
    Bar(String),
    Baz
}

#[hdk_entry(id = "foo", visibility = "public" )]
#[derive(Clone, Debug)]
struct Foo (String);

#[hdk_entry(id = "bar", visibility = "public" )]
#[derive(Clone)]
struct Bar {
    foo: bool
}

#[derive(Deserialize, Serialize, SerializedBytes)]
struct StringWrapper(String);

entry_defs![
    Path::entry_def(),
    Foo::entry_def(),
    Bar::entry_def()
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
fn get_author_of_foo(input: StringWrapper) -> ExternResult<Links> {
    debug!("payload for get_author_of_foo {:#?}", input.0.clone())?;
    let base = Foo(input.0.to_owned());
    debug!("base for get_author_of_foo {:#?}", base.clone())?;
    let base_hash = hash_entry!(&base)?;
    debug!("base_hash for get_author_of_foo {:#?}", base_hash.clone())?;
    let links = get_links!(base_hash)?;
    debug!("links for get_author_of_foo {:#?}", links.clone())?;
    Ok(links)
}