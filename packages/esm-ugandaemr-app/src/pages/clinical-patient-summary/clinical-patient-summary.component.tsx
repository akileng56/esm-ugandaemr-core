import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './clinical-patient-summary.scss';
import { usePatient } from '@openmrs/esm-framework';
import ClinicalPatientSummaryTabs from './clinical-patient-summary-tabs/clinical-patient-summary-tabs.component';
import { getClinicalData } from './clincial-patient-summary';
import { EmptyState } from '@openmrs/esm-patient-common-lib';

export interface ClinicalPatientProps {
  patientUuid: string;
}

type obs = {
  name: string;
  value: string;
  date: string;
  encounter: string;
};

const ClinicalPatientSummary: React.FC<ClinicalPatientProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const [obsData, setObsData] = useState([]);
  const { patient } = usePatient(patientUuid);

  const uniqueEncounters = (data) => {
    const seen = new Set();

    return data.filter((item) => {
      const duplicate = seen.has(item?.encounter);
      seen.add(item?.encounter);
      return !duplicate;
    });
  };

  useEffect(() => {
    getClinicalData().then((response) => {
      let obsArray: Array<obs> = [];
      const observations = response['entry']?.filter(
        (entryItem) => entryItem?.resource?.resourceType === 'Observation',
      );
      observations?.map((obsItem) => {
        obsArray.push({
          name: obsItem?.resource?.code?.text,
          value: obsItem?.resource?.valueQuantity?.value + ' ' + obsItem?.resource?.valueQuantity?.unit,
          date: obsItem?.resource?.effectiveDateTime,
          encounter: obsItem?.resource?.encounter?.reference,
        });
      });
      setObsData(obsArray);
    });
  }, []);

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.card}>
        <br></br>
        {uniqueEncounters(obsData)?.length > 0 ? (
          uniqueEncounters(obsData)
            ?.sort((a, b) => b.encounter - a.encounter)
            ?.map((encounter, index) => (
              <div key={encounter?.encounter} className={styles.section}>
                <div className={styles.sectionTitle}>{t(`encounterDetails-${index}`, `Encounter`)}</div>
                <div key={index} className={styles.container}>
                  {obsData
                    ?.filter((obs) => obs?.encounter === encounter?.encounter)
                    ?.map((obs) => (
                      <div className={styles.content}>
                        <p className={styles.label}>{obs?.name}</p>
                        <span className={styles.value}>{obs?.value}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))
        ) : (
          <EmptyState headerTitle={`Patient Information`} displayText={`clinical data`} />
        )}
      </div>
    </div>
  );
};
export default ClinicalPatientSummary;
