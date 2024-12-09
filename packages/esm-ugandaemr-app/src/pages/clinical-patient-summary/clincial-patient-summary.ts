export async function getClinicalData() {
  let apiUrl = `https://hapi.devearea.com/hapi-fhir-jpaserver/fhir//Patient?identifier=10000X&_include=Patient:link&_revinclude=Encounter:patient&_revinclude=Observation:patient`;

  const jsonData = await fetch(apiUrl);

  return await jsonData.json();
}
