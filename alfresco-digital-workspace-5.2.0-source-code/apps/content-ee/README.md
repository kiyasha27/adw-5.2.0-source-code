# Alfresco Digital Workspace

This folder contains the source code of the Alfresco Digital Workspace applications, which is based on the Alfresco Content Application + "out of the box" Alfresco extensions.
Project structure is based on the [Nx Workspace](https://nx.dev/angular) dev tools for monorepos.

## Running

In the project root folder, create an `.env` file:

```yaml
BASE_URL="<url>"
```

Run the following commands:

```shell
npm install
npm start content-ee
```

## Building 

Run the following to build the code for distribution

```shell
npm install
npm run build content-ee
```

The output can be found at `dist/alfresco-digital-workspace` folder.

### Libraries

The workspace contains the following libraries:

| Name                                                                                                                           | Description                         |
|--------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| [content-services-extension](../../libs/content-ee/content-services-extension/README.md)                                       | Alfresco Content Services extension |
| [governance](../../libs/content-ee/governance/README.md)                                                                       | Alfresco Governance extension       |
| [microsoft-office-online-integration-extension](../../libs/content-ee/microsoft-office-online-integration-extension/README.md) | Office365 extension                 |
| [process-services-extension](../../libs/content-ee/process-services-extension/README.md)                                       | Alfresco Process Services extension |

For the full set of projects please refer to the "libs/content-ee" folder.

## Compiling without Extensions

To exclude any of the bundled extensions you need to update the `apps/content-ee/src/app/extensions.module.ts` file.

```ts
@NgModule({
    imports: [
        AosExtensionModule,
        AcaAboutModule,
        AcaSettingsModule,
        AiViewModule,
        RecordModule,
        ProcessServicesExtensionModule,
        ContentServicesExtensionModule,
    ],
})
export class AppExtensionsModule {}
```

Remove the modules that correspond to the extension you want to exclude from the build.

## See Also

- [Migration guide from 1.4.x to 2.0.x](/developer-docs/content-apps/upgrade-content-apps-from-1.[4,6].x-2.0.x.md)
- [Extending Alfresco Digital Workspace](/developer-docs/content-apps/extending.md)
- [Docker support for ADW](/developer-docs/content-apps/docker.md)
- [Enable the Process Service plugin](/libs/content-ee/process-services-extension/README.md)
- [How to use ACA](/developer-docs/content-apps/how-to-use-aca.md)
