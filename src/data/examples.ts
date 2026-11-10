export interface GhazalExample {
  title: string;
  poet: string;
  baharId: number;
  baharName: string;
  text: string;
  notes?: string;
  isPerfectSample: boolean;
}

export const GHAZAL_EXAMPLES: GhazalExample[] = [
  {
    title: "નયનને બંધ રાખીને (છંદ ૧)",
    poet: "બરકત વિરાણી 'બેફામ'",
    baharId: 1,
    baharName: "છંદ ૧ (લગાગા લગાગા લગાગા લગાગા)",
    text: `નયનને બંધ રાખીને જોયા છે તમને
મને સ્મિત તારું દીધું તેં છતાં પણ
ગઝલ હું લખું છું તમારી જ યાદે
હૃદયમાં વસીને રહ્યા છો સદાયે`,
    notes: "બહરે હઝજ મુસમ્મન સાલિમ - લલ=ગા છૂટ સાથે અદભુત પ્રવાહ.",
    isPerfectSample: true,
  },
  {
    title: "દિલમાં કોઈની યાદનાં પગલાં (છંદ ૧)",
    poet: "મરીઝ (ગુજરાતના ગાલિબ)",
    baharId: 1,
    baharName: "છંદ ૧ (લગાગા લગાગા લગાગા લગાગા)",
    text: `નથી કોઈનું સ્થાન મારા હૃદયમાં
તમારી જ યાદો ભરેલી છે મનમાં`,
    notes: "મરીઝ સાહેબની પ્રસિદ્ધ પંક્તિઓ.",
    isPerfectSample: true,
  },
  {
    title: "જ્યાં જ્યાં નજર મારી ઠરે (છંદ ૧૦)",
    poet: "કલાપી",
    baharId: 10,
    baharName: "છંદ ૧૦ (લગાગાગા લગાગાગા લગાગાગા લગાગાગા)",
    text: `જ્યાં જ્યાં નજર મારી ઠરે યાદી ભરી ત્યાં આપની
આંસુ મહીં પણ છે અમીરસ આપની એ ચાહની`,
    notes: "બહરે રમલ મુસમ્મન સાલિમ (ફાઈલાતુન ૪ વખત) - કલાપીનો અમર શેર.",
    isPerfectSample: true,
  },
  {
    title: "સાંજ પડે ને યાદ (છંદ ૨૦)",
    poet: "પરંપરાગત",
    baharId: 20,
    baharName: "છંદ ૨૦ (૮ વખત ગા)",
    text: `સાંજ પડે ને યાદ તમારી
આંખ મહીં છે પ્યાસ તમારી`,
    notes: "સર્વગુરુ ૮ માત્રાઓની બહર - સરળ અને સંગીતમય.",
    isPerfectSample: true,
  },
  {
    title: "છંદભંગ પરીક્ષણ (Intentional Error Test)",
    poet: "પરીક્ષણ માટે નમૂનો",
    baharId: 1,
    baharName: "છંદ ૧ (લગાગા લગાગા લગાગા લગાગા)",
    text: `નયનને બંધ રાખીને જોયા છે તમને
આજે હું આવ્યો છું તમારા ઘરે મળવા`,
    notes: "બીજી પંક્તિમાં જાણીજોઈને છંદભંગ રાખવામાં આવ્યો છે જેથી તમે લાલ કલરનું અંડરલાઈન અને માત્રાની ભૂલ પકડી શકો.",
    isPerfectSample: false,
  },
];
