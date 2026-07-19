// Known company names → expected email domain patterns
// The key is the company name (lowercase); the value is an array of acceptable domain suffixes.
const COMPANY_DOMAINS: Record<string, string[]> = {
  'tcs': ['tcs.com', 'tcs.co.in'],
  'infosys': ['infosys.com', 'infosys.co.in'],
  'wipro': ['wipro.com', 'wipro.co.in'],
  'hcl': ['hcltech.com', 'hcl.com', 'hclinfosystems.com'],
  'tech mahindra': ['techmahindra.com', 'mahindra.com'],
  'mahindra': ['mahindra.com', 'techmahindra.com'],
  'cognizant': ['cognizant.com'],
  'accenture': ['accenture.com'],
  'ibm': ['ibm.com'],
  'capgemini': ['capgemini.com'],
  'deloitte': ['deloitte.com', 'deloitte.co.in'],
  'ey': ['ey.com', 'ey.net'],
  'pwc': ['pwc.com', 'pwc.in'],
  'kpmg': ['kpmg.com', 'kpmg.co.in'],
  'google': ['google.com'],
  'microsoft': ['microsoft.com', 'outlook.com'],
  'amazon': ['amazon.com', 'amazon.in'],
  'meta': ['meta.com', 'facebook.com'],
  'flipkart': ['flipkart.com'],
  'byju': ['byjus.com', 'byju.com'],
  'zoho': ['zoho.com', 'zoho.in'],
  'freshworks': ['freshworks.com', 'freshdesk.com'],
  'swiggy': ['swiggy.com'],
  'zomato': ['zomato.com'],
  'ola': ['olacabs.com', 'olamobility.com'],
  'paytm': ['paytm.com'],
  'reliance': ['ril.com', 'reliance.com', 'jio.com'],
  'tata': ['tata.com', 'tataelxsi.com', 'tatamotors.com'],
  'adani': ['adani.com'],
  'infosys bpm': ['infosys.com'],
  'mindtree': ['mindtree.com', 'ltimindtree.com'],
  'ltimindtree': ['ltimindtree.com', 'mindtree.com'],
  'mphasis': ['mphasis.com'],
  'ntt data': ['nttdata.com'],
  'ntt': ['ntt.com', 'nttdata.com'],
  'samsung': ['samsung.com', 'samsungindia.com'],
  'oracle': ['oracle.com'],
  'sap': ['sap.com'],
  'salesforce': ['salesforce.com'],
  'adobe': ['adobe.com'],
  'vmware': ['vmware.com'],
  'cisco': ['cisco.com'],
  'dell': ['dell.com'],
  'hp': ['hp.com', 'hpe.com'],
  'intel': ['intel.com'],
  'nvidia': ['nvidia.com'],
  'uber': ['uber.com'],
  'airbnb': ['airbnb.com'],
  'atlassian': ['atlassian.com'],
  'linkedin': ['linkedin.com'],
};

interface CompanyEmailValidation {
  valid: boolean;
  error?: string;
}

/**
 * Validates that the work email domain matches the selected company.
 *
 * Flow:
 *  1. Extract the domain from the email (e.g. "john@tcs.com" → "tcs.com")
 *  2. Look up the company name in the COMPANY_DOMAINS map
 *  3. Check if the email domain ends with any of the known domains for that company
 *  4. If company is not in the map, do a fuzzy check: does the domain contain the company name?
 */
export function validateCompanyEmail(
  workEmail: string,
  companyName: string
): CompanyEmailValidation {
  if (!workEmail || !companyName) {
    return { valid: true }; // Skip validation if fields are empty (other validators handle that)
  }

  const domain = workEmail.split('@')[1]?.toLowerCase().trim();
  if (!domain) {
    return { valid: false, error: 'Invalid email address.' };
  }

  const normalisedCompany = companyName.toLowerCase().trim();

  // Exact lookup in our known-company map
  const knownDomains = COMPANY_DOMAINS[normalisedCompany];

  if (knownDomains) {
    const matches = knownDomains.some((d) => domain === d || domain.endsWith('.' + d));
    if (!matches) {
      return {
        valid: false,
        error: `Email domain "@${domain}" does not match company "${companyName}". Expected one of: ${knownDomains.join(', ')}`,
      };
    }
    return { valid: true };
  }

  // Unknown company — fuzzy check: domain should contain part of the company name
  const companyWords = normalisedCompany.split(/\s+/).filter((w) => w.length > 2);
  const domainParts = domain.replace(/\.(com|co\.in|in|org|net|io)$/, '').split(/[.-]/);

  const fuzzyMatch = companyWords.some((word) =>
    domainParts.some((part) => part.includes(word) || word.includes(part))
  );

  if (!fuzzyMatch) {
    return {
      valid: false,
      error: `Email domain "@${domain}" does not appear to belong to "${companyName}". Please use your official ${companyName} work email.`,
    };
  }

  return { valid: true };
}
