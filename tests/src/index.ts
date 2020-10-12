import { Orchestrator } from '@holochain/tryorama';
import { Config } from '@holochain/tryorama'

const orchestrator = new Orchestrator();

// Configure a conductor with two identical DNAs,
// differentiated by UUID, nicknamed "alice" and "bobbo"
const config = Config.gen({
    alice: Config.dna('../testlab.dna.gz', null),
    bobbo: Config.dna('../testlab.dna.gz', null),
  })

const delay = (ms) => new Promise((r) => setTimeout(r, ms))


orchestrator.registerScenario('Scenario 1: alice create and alice direclt get links from zomeone', async (s, t) => {
  // spawn the conductor process
  const { conductor } = await s.players({ conductor: config });
  await conductor.spawn();

  const [dna_hash_1, agent_pubkey_alice] = conductor.cellId('alice');

  await conductor.call("alice", "zomeone", "create_foo_and_link_to_path", null);
  await delay(1000);

  // Works with no problem
  let links = await conductor.call("alice", "zomeone", "get_links_from_path", "bar");
  console.log("tatsuya sato 1");
  console.log(links)

  t.deepEqual(links.length, 1);
});

orchestrator.registerScenario('Scenario 2: bobby create and alice get links from zomeone', async (s, t) => {
  // spawn the conductor process
  const { conductor } = await s.players({ conductor: config })
  await conductor.spawn()

  const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobbo');

  await conductor.call("bobbo", "zomeone", "create_foo_and_link_to_path", null);
  await delay(1000);

  // works with no problem too
  let links = await conductor.call("alice", "zomeone", "get_links_from_path", "bar");

  t.deepEqual(links.length, 1);
});

orchestrator.registerScenario('Scenario 3: alice create and alice remotely get links from zometwo', async (s, t) => {
  // spawn the conductor process
  const { conductor } = await s.players({ conductor: config })
  await conductor.spawn()

  const [dna_hash_1, agent_pubkey_alice] = conductor.cellId('alice');

  await conductor.call("alice", "zomeone", "create_foo_and_link_to_path", null);
  await delay(1000);

  // this works with no problem as well
  let links = await conductor.call("alice", "zometwo", "get_links_from_path_from_zomeone", null);

  t.deepEqual(links.length, 1);

});

// orchestrator.registerScenario('Scenario 4: bobby create and alice get links from path remotely from zometwo', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobby');

//   await conductor.call("bobby", "zomeone", "create_foo_and_link_to_path", null);
//   await delay(100000);

//   // now this doesn't work because the links return an empty array inside the get_author function
//   let links = await conductor.call("alice", "zometwo", "get_links_from_path_from_zomeone", null);

//   t.deepEqual(links.length, 1);
// });

// orchestrator.registerScenario('Scenario 5: bobby creates and alice get links from foo from zomeone', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobby');

//   await conductor.call("bobby", "zomeone", "create_and_link_foo", null);
//   await delay(10000);

//   // now this doesn't work because the links return an empty array inside the get_author function
//   let links = await conductor.call("alice", "zometwo", "get_links_from_foo_from_zomeone", null);

//   t.deepEqual(links.length, 1);
// });

// orchestrator.registerScenario('Scenario 6: alice creates and alice calls remotely to bobbos cell to get links ', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobbo');
//   // bobbo grants capability for function get_links_from_foo to be called unrestrictedly.
//   await conductor.call("bobbo", "zomeone", "create_cap_grant", null);

//   // alice commit Foo("foo") and Foo("foofoo"), and create a link (base: Foo("foo"), target: Foo("foofoo").
//   await conductor.call("bobbo", "zomeone", "create_and_link_foo", null);
//   await delay(10000);

//   // alice calls function `caller` which invoke `call_remote` which invokes get_links_from_foo in bobbo's cell
//   let links = await conductor.call("alice", "zomeone", "caller", agent_pubkey_bobby);
//   console.log("get links remotely");
//   console.log(links);

//   // this fails as links returned from alice's call_remote to bobbo's to be 0
//   t.deepEqual(links.length, 1);
// });

// orchestrator.registerScenario('Scenario 7: linking private entries and getting the link', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobbo');
//   await conductor.call("alice", "zomeone", "create_foofoo_and_link", null);

//   await delay(10000);
  
  // let links = await conductor.call("alice", "zomeone", "get_links_from_foofoo", null);
  // console.log("get private links");
  // console.log(links);

  // this fails as links returned from alice's call_remote to bobbo's to be 0
  // t.deepEqual(links.length, 1);
// });


orchestrator.run()

