'use server'

import { unstable_cache } from 'next/cache';
import { listArtifacts, Artifacts, Artifact } from "./actions";

const getCachedArtifacts = unstable_cache(
  listArtifacts,
  undefined,
  { revalidate: 3600 },
);

const ArtifactsTable = (props: { artifacts: Artifact[] }) => (
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>JDK</th>
        <th>Debug Level</th>
        <th><a href="https://en.wikipedia.org/wiki/Profile-guided_optimization">PGO</a></th>
        <th>File</th>
      </tr>
    </thead>
    <tbody>
      {props.artifacts.map((artifact) => (
        <tr key={artifact.file}>
          <td>{artifact.date}</td>
          <td>{artifact.jdk}</td>
          <td>{artifact.profile}</td>
          <td className={artifact.pgo ? "text-green-400" : "text-orange-400"}>{artifact.pgo ? "✔" : "✘"}</td>
          <td>
            <a href={`https://storage.cloud.google.com/lxr-builds/${artifact.file}`}>{artifact.file}</a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default async function Home() {
  const artifacts: Artifacts = await getCachedArtifacts();

  const latestArtifacts = [
    artifacts.latest.release,
    artifacts.latest.fastdebug,
    artifacts.latest.slowdebug,
  ].filter((artifact) => artifact !== undefined);

  return (
    <div>
      <main>
        <header>
          <h1>LXR GC Nightly Builds</h1>
          <div className="badges">
            <p>
              <a href="https://github.com/wenyuzhao/mmtk-openjdk/tree/lxr">MMTk-OpenJDK</a> nightly builds with <a href="https://dl.acm.org/doi/pdf/10.1145/3519939.3523440">LXR GC</a>.
            </p>
            <p>
              <label>GitHub Workflow Status:</label>
              <a href="https://github.com/wenyuzhao/lxr-builds/actions/workflows/jdk11-mmtk-lxr.yml">
                <img src="https://img.shields.io/github/actions/workflow/status/wenyuzhao/lxr-builds/jdk11-mmtk-lxr.yml?label=jdk11-mmtk-lxr&amp;logo=github&amp;style=for-the-badge&amp;branch=main" alt="jdk11-lxr-status" />
              </a>
            </p>
            <p>
              <label>Source Code:</label>
              <a href="https://github.com/wenyuzhao/mmtk-core/tree/lxr">
                <img src="https://img.shields.io/github/stars/wenyuzhao/mmtk-core?label=mmtk-core%40lxr&amp;logo=github&amp;style=for-the-badge" alt="mmtk-core" />
              </a>
              <a href="https://github.com/wenyuzhao/mmtk-openjdk/tree/lxr">
                <img src="https://img.shields.io/github/stars/wenyuzhao/mmtk-openjdk?label=mmtk-openjdk%40lxr&amp;logo=github&amp;style=for-the-badge" alt="mmtk-openjdk" />
              </a>
            </p>
            <p>
              <label>Paper:</label>
              <a href="https://dl.acm.org/doi/pdf/10.1145/3519939.3523440">
                <img src="https://img.shields.io/badge/DOI-10.1145/3519939.3523440-green.svg?style=for-the-badge" alt="doi" />
              </a>
            </p>
          </div>
        </header>

        <section>
          <h1>Latest Builds</h1>
          <ArtifactsTable artifacts={latestArtifacts} />
        </section>

        <section>
          <h1>All Nightly Builds</h1>
          <ArtifactsTable artifacts={artifacts.all} />
        </section>
      </main>
      <footer>
        © 2025 <a href="https://wenyu.me">Wenyu Zhao</a>, <a href="https://mmtk.io">The MMTk Project</a>.
      </footer>
    </div>
  );
}
