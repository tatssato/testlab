import { Orchestrator } from '@holochain/tryorama';
import { Config } from '@holochain/tryorama'

const orchestrator = new Orchestrator();

// Configure a conductor with two identical DNAs,
// differentiated by UUID, nicknamed "alice" and "bobbo"
const config = Config.gen({
    alice: Config.dna('../testlab.dna.gz', null),
    bobby: Config.dna('../testlab.dna.gz', null),
  })

const delay = (ms) => new Promise((r) => setTimeout(r, ms))


// orchestrator.registerScenario('Scenario 1: alice create and alice direclt get links from zomeone', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config });
//   await conductor.spawn();

//   const [dna_hash_1, agent_pubkey_alice] = conductor.cellId('alice');

//   await conductor.call("alice", "zomeone", "create_foo_and_link_to_path", null);
//   await delay(1000);

//   // Works with no problem
//   let links = await conductor.call("alice", "zomeone", "get_links_from_path", "bar");
//   console.log("tatsuya sato 1");
//   console.log(links)

//   t.deepEqual(links.length, 1);
// });

// orchestrator.registerScenario('Scenario 2: bobby create and alice get links from zomeone', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobby');

//   await conductor.call("bobby", "zomeone", "create_foo_and_link_to_path", null);
//   await delay(1000);

//   // works with no problem too
//   let links = await conductor.call("alice", "zomeone", "get_links_from_path", "bar");

//   t.deepEqual(links.length, 1);
// });

// orchestrator.registerScenario('Scenario 3: alice create and alice remotely get links from zometwo', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_1, agent_pubkey_alice] = conductor.cellId('alice');

//   await conductor.call("alice", "zomeone", "create_foo_and_link_to_path", null);
//   await delay(1000);

//   // this works with no problem as well
//   let links = await conductor.call("alice", "zometwo", "get_links_from_path_from_zomeone", null);

//   t.deepEqual(links.length, 1);

// });

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

orchestrator.registerScenario('Scenario 5: bobby creates and alice get links from foo from zomeone', async (s, t) => {
  // spawn the conductor process
  const { conductor } = await s.players({ conductor: config })
  await conductor.spawn()

  const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobby');

  await conductor.call("bobby", "zomeone", "create_and_link_foo", null);
  await delay(10000);

  // now this doesn't work because the links return an empty array inside the get_author function
  let links = await conductor.call("alice", "zometwo", "get_links_from_foo_from_zomeone", null);

  t.deepEqual(links.length, 1);
});


orchestrator.run()

