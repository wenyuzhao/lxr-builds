'use server'

import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = "lxr-builds";

const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS as string, 'base64').toString()
);
const STORAGE = new Storage({
    credentials,
});

// FILE NAME FORMAT: jdk11-linux-x86_64-normal-server-mmtk-lxr-release-20220925
// EXTENSION: .tar.gz

export type JDKBuildProfile = "release" | "fastdebug" | "slowdebug";

export type Artifact = {
    date: string;
    profile: JDKBuildProfile;
    jdk: string;
    file: string;
    pgo: boolean;
}

export type Artifacts = {
    all: Artifact[];
    latest: {
        release: Artifact | undefined;
        release_pgo: Artifact | undefined;
    }
};

export async function listArtifacts(): Promise<Artifacts> {
    const bucket = STORAGE.bucket(BUCKET_NAME);
    const [fileObjs] = await bucket.getFiles();
    const files = fileObjs.map((file) => file.name);
    let artifacts: Artifact[] = files.map(name => {
        const stem = name.split(".")[0];
        const segments = stem.split("-");
        let date = segments[segments.length - 1];
        date = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        let profile: JDKBuildProfile;
        let pgo = false;
        if (segments[segments.length - 2] === "pgo") {
            profile = segments[segments.length - 3] as JDKBuildProfile;
            pgo = true;
        } else {
            profile = segments[segments.length - 2] as JDKBuildProfile;
            pgo = false;
        }
        return {
            file: name,
            date,
            profile,
            jdk: segments[0].slice(3),
            pgo,
        }
    });
    artifacts = artifacts.filter(a => a.profile === "release");
    const sorted_artifacts = artifacts.sort((a, b) => {
        // Sort by date
        if (a.date !== b.date) {
            return parseInt(b.date.replaceAll("-", "")) - parseInt(a.date.replaceAll("-", ""));
        }
        // Sort by profile
        if (a.profile !== b.profile) {
            if (a.profile === "release") {
                return -1;
            } else if (b.profile === "release") {
                return 1;
            } else if (a.profile === "fastdebug") {
                return -1;
            } else if (b.profile === "fastdebug") {
                return 1;
            } else {
                return 0;
            }
        }
        // Sort by pgo
        if (a.pgo !== b.pgo) {
            return a.pgo ? -1 : 1;
        }
        return 0;
    });
    const latest_release_build = sorted_artifacts.find(artifact => artifact.profile === "release" && !artifact.pgo);
    const latest_release_pgo_build = sorted_artifacts.find(artifact => artifact.profile === "release" && artifact.pgo);

    return {
        all: sorted_artifacts,
        latest: {
            release: latest_release_build,
            release_pgo: latest_release_pgo_build,
        },
    }
}