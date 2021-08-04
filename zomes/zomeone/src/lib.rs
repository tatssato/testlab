use hdk::prelude::*;

// used for testing the links in call_remote
#[hdk_entry(id = "foo", visibility = "public")]
#[derive(Clone)]
struct Foo(String);

// used for testing linking private entries
#[hdk_entry(id = "foofoo", visibility = "private")]
#[derive(Clone)]
struct FooFoo(String);

entry_defs![Path::entry_def(), Foo::entry_def(), FooFoo::entry_def()];

#[hdk_extern]
fn emit_signal_20(_: ()) -> ExternResult<()> {
    let foo = Foo("testing emit_signal".to_owned());
    for _ in 0..20 {
        emit_signal(foo.clone())?;
    }
    Ok(())
}

#[hdk_extern]
fn create_and_link_foo(_: ()) -> ExternResult<bool> {
    create_entry(&Foo("foo".to_string()))?;
    Ok(true)
}

// #[hdk_extern]
// fn get_foo_foo(_: ()) -> ExternResult<FooFoo> {
//     let base_hash = hash_entry(&Foo("foo".to_string()))?;
//     let tag = LinkTag::new("foos");
//     let links = get_links(base_hash, Some(tag))?.into_inner();
//     let get_option = GetOptions::latest();
//     let target = get(links[0].target.clone(), get_option)?.unwrap().into_inner();
//     let foofoo: FooFoo = target.1.to_app_option()?.unwrap();
//     Ok(foofoo)
// }

// #[hdk_extern]
// fn create_and_link_foofoo(_: ()) -> ExternResult<()> {
//     let base = FooFoo("foofoo".to_string());
//     let base_hash = hash_entry(&base)?;
//     let target = Foo("foo".to_string());
//     let target_hash = hash_entry(&target)?;
//     let tag = LinkTag::new("foos");
//     create_entry(&base)?;
//     create_entry(&target)?;
//     create_link(base_hash, target_hash, tag)?;
//     Ok(())
// }

// #[hdk_extern]
// fn get_foo(_: ()) -> ExternResult<Foo> {
//     let base_hash = hash_entry(&FooFoo("foofoo".to_string()))?;
//     let tag = LinkTag::new("foos");
//     let links = get_links(base_hash, Some(tag))?.into_inner();
//     let get_option = GetOptions::latest();
//     let target = get(links[0].target.clone(), get_option)?.unwrap().into_inner();
//     let foo: Foo = target.1.to_app_option()?.unwrap();
//     Ok(foo)
// }
