import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { configSchema } from './config-schema';
import { dashboardMeta } from './dashboard.meta';
import programsOverviewComponent from './programs/programs-overview.component';
import programsDetailedSummaryComponent from './programs/programs-detailed-summary.component';

const moduleName = '@openmrs/esm-patient-programs-app';

const options = {
  featureName: 'patient-programs',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const programsOverview = getSyncLifecycle(programsOverviewComponent, options);

export const programsDetailedSummary = getSyncLifecycle(programsDetailedSummaryComponent, options);

export const programsDashboardLink =
  // t('Programs', 'Programs')
  getSyncLifecycle(
    createDashboardLink({
      ...dashboardMeta,
      moduleName,
    }),
    options,
  );

export const programsForm = getAsyncLifecycle(() => import('./programs/programs-form.component'), options);