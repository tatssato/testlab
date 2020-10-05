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


// orchestrator.registerScenario('Scenario 1: directly calling create and get from zomeone to get own key from entry', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config });
//   await conductor.spawn();

//   const [dna_hash_1, agent_pubkey_alice] = conductor.cellId('alice');

//   await conductor.call("alice", "zomeone", "create_foo", null);
//   await delay(1000);

//   // Works with no problem
//   let get_alice_key = await conductor.call("alice", "zomeone", "get_author_of_foo", "bar");
//   console.log("tatsuya sato 1");
//   console.log(get_alice_key)

//   t.deepEqual(get_alice_key, agent_pubkey_alice);
// });

// orchestrator.registerScenario('Scenario 2: directly calling create and get from zomeone to get bobby key from entry', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobby');

//   await conductor.call("bobby", "zomeone", "create_foo", null);
//   await delay(1000);

//   // works with no problem too
//   let get_bobby_key = await conductor.call("alice", "zomeone", "get_author_of_foo", "bar");

//   t.deepEqual(get_bobby_key, agent_pubkey_bobby);
// });

// orchestrator.registerScenario('Scenario 3: directly calling create but remotely call get zometwo to get own key from entry', async (s, t) => {
//   // spawn the conductor process
//   const { conductor } = await s.players({ conductor: config })
//   await conductor.spawn()

//   const [dna_hash_1, agent_pubkey_alice] = conductor.cellId('alice');

//   await conductor.call("alice", "zomeone", "create_foo", null);
//   await delay(1000);

//   // this works with no problem as well
//   let get_alice_key = await conductor.call("alice", "zometwo", "get_author_of_foo_from_zomeone", null);

//   t.deepEqual(get_alice_key, agent_pubkey_alice);

// });

orchestrator.registerScenario('Scenario 4: directly calling create but remotely call get zometwo to get both key from entry', async (s, t) => {
  // spawn the conductor process
  const { conductor } = await s.players({ conductor: config })
  await conductor.spawn()

  const [dna_hash_2, agent_pubkey_bobby] = conductor.cellId('bobby');

  await conductor.call("bobby", "zomeone", "create_foo", null);
  await delay(1000);

  // now this doesn't work because the links return an empty array inside the get_author function
  let get_bobby_key = await conductor.call("alice", "zometwo", "get_author_of_foo_from_zomeone", null);

  t.deepEqual(get_bobby_key, agent_pubkey_bobby);
});


orchestrator.run()

