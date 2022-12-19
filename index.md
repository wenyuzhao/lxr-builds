---
title: LXR GC Nightly Builds
description: LXR GC Nightly Builds
layout: default
---

# LXR GC Nightly Builds

[MMTk-OpenJDK](https://github.com/wenyuzhao/mmtk-openjdk/tree/lxr) nightly builds with [LXR GC](https://dl.acm.org/doi/pdf/10.1145/3519939.3523440).

<span style="line-height: 2em">***GitHub Workflow Status:*** [![jdk11-lxr-status](https://img.shields.io/github/actions/workflow/status/wenyuzhao/lxr-builds/jdk11-mmtk-lxr.yml?label=jdk11-mmtk-lxr&logo=github&style=for-the-badge&branch=main)](https://github.com/wenyuzhao/lxr-builds/actions/workflows/jdk11-mmtk-lxr.yml) [![pages-status](https://img.shields.io/github/actions/workflow/status/wenyuzhao/lxr-builds/github-pages.yml?label=github-pages&logo=github&style=for-the-badge&branch=main)](https://github.com/wenyuzhao/lxr-builds/actions/workflows/github-pages.yml)</span>

<span style="line-height: 2em">***Source Code:*** [![mmtk-core](https://img.shields.io/github/stars/wenyuzhao/mmtk-core?label=mmtk-core%40lxr&logo=github&style=for-the-badge)](https://github.com/wenyuzhao/mmtk-core/tree/lxr) [![mmtk-openjdk](https://img.shields.io/github/stars/wenyuzhao/mmtk-openjdk?label=mmtk-openjdk%40lxr&logo=github&style=for-the-badge)](https://github.com/wenyuzhao/mmtk-openjdk/tree/lxr)</span>

<span style="line-height: 2em">***Paper:*** [![doi](https://img.shields.io/badge/DOI-10.1145/3519939.3523440-green.svg?style=for-the-badge)](https://dl.acm.org/doi/pdf/10.1145/3519939.3523440)</span>


{% include load-builds.html %}

# Latest Builds

| Date | JDK | Debug Level | File |
| ---- | ---:| ----------- | ---- |
{% for build in latest_builds -%}
| {{ build.date }} | {{ build.jdk }} | {{ build.debug_level }} | [{{ build.name }}]({{ build.browser_download_url }}) |
{% endfor %}


# All Nightly Builds

| Date | JDK | Debug Level | File |
| ---- | ---:| ----------- | ---- |
{% for build in builds -%}
| {{ build.date }} | {{ build.jdk }} | {{ build.debug_level }} | [{{ build.name }}]({{ build.browser_download_url }}) |
{% endfor %}
