'use server'

import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = "lxr-builds";
const STORAGE = new Storage();

// FILE NAME FORMAT: jdk11-linux-x86_64-normal-server-mmtk-lxr-release-20220925
// EXTENSION: .tar.gz

export type JDKBuildProfile = "release" | "fastdebug" | "slowdebug";

export type Artifact = {
    date: string;
    profile: JDKBuildProfile;
    jdk: string;
    file: string;
}

export type Artifacts = {
    all: Artifact[];
    latest: {
        release: Artifact | undefined;
        fastdebug: Artifact | undefined;
        slowdebug: Artifact | undefined;
    }
};

export async function listArtifacts(): Promise<Artifacts> {
    const bucket = STORAGE.bucket(BUCKET_NAME);
    const [fileObjs] = await bucket.getFiles();
    const files = fileObjs.map((file) => file.name);
    const artifacts: Artifact[] = files.map(name => {
        const stem = name.split(".")[0];
        const segments = stem.split("-");
        const profile = segments[segments.length - 2];
        let date = segments[segments.length - 1];
        date = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        return {
            file: name,
            date,
            profile: profile as JDKBuildProfile,
            jdk: segments[0].slice(3),
        }
    });
    const sorted_by_date_and_profile = artifacts.sort((a, b) => {
        if (a.date === b.date) {
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
        } else {
            return parseInt(b.date.replaceAll("-", "")) - parseInt(a.date.replaceAll("-", ""));
        }
    });
    const latest_release_build = sorted_by_date_and_profile.find(artifact => artifact.profile === "release");
    const latest_fastdebug_build = sorted_by_date_and_profile.find(artifact => artifact.profile === "fastdebug");
    const latest_slowdebug_build = sorted_by_date_and_profile.find(artifact => artifact.profile === "slowdebug");
    return {
        all: sorted_by_date_and_profile,
        latest: {
            release: latest_release_build,
            fastdebug: latest_fastdebug_build,
            slowdebug: latest_slowdebug_build,
        },
    }
}