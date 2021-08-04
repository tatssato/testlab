import { Config, Orchestrator, InstallAgentsHapps } from "@holochain/tryorama";
import { ScenarioApi } from "@holochain/tryorama/lib/api";
import path from "path";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const config = Config.gen();
let testlabDNA = path.join(__dirname, "../../workdir/dna/testlab.dna");

const installAgent: InstallAgentsHapps = [[[testlabDNA]], [[testlabDNA]]];

const orchestrator = new Orchestrator();

// orchestrator.registerScenario('link from public to private', async (s: ScenarioApi, t) => {
//   const [conductor] = await s.players([config]);
//   const [[alice_lobby_happ], [bobby_lobby_happ]] = await conductor.installAgentsHapps(installAgent);
//   const [alice_cell] = alice_lobby_happ.cells;
//   const [bobby_cell] = bobby_lobby_happ.cells;

//   await alice_cell.call('zomeone', 'create_and_link_foo', null);
//   let foofoo = await alice_cell.call('zomeone', 'get_foo_foo', null);
//   console.log("---------is link working?---------")
//   console.log(foofoo);
// });

orchestrator.registerScenario(
  "link from private to public",
  async (s: ScenarioApi, t) => {
    const [conductor] = await s.players([config]);
    const [[alice_lobby_happ], [bobby_lobby_happ]] =
      await conductor.installAgentsHapps(installAgent);
    const alice_cell = alice_lobby_happ.cells[0];

    let foo = await alice_cell.call("zomeone", "create_and_link_foo", null);
    t.ok(foo);
  }
);

orchestrator.run();
