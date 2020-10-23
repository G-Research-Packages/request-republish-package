# request-republish-package

GitHub action which uploads a package as a GitHub Artifact, then logs a particular message which is observed by a workflow in another repo which will pick up the artifact and republish it as a GitHub Package. The workflow in the other repository is expected to use [G-Research-Packages/check-and-republish-packages](https://github.com/G-Research-Packages/check-and-republish-packages).

## Why?

This action (combined with [G-Research-Packages/check-and-republish-packages](https://github.com/G-Research-Packages/check-and-republish-packages) and some carefully crafted permissions)
can be used to ensure that all of the GitHub packages on a GitHub org have been built from protected branches. This is useful where the packages are to be relied upon in a
secure environment. For further details see SDR-816 in G-Research internal JIRA.

## Example usage

See [action.yaml](action.yaml).

```yaml
- uses: G-Research-Packages/request-republish-package@v1
  with:
    package-path: GR.Example.DotNetCoreClassLib/bin/Release/GR.Example.DotNetCoreClassLib.*.nupkg
```

## License

TBC.
