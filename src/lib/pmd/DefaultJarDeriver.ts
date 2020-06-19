import {PMD_LIB, PMD_VERSION} from './PmdSupport';
import path = require('path');

const LANGUAGES_BY_ALIAS: Map<string, string>  = new Map([
	['apex', 'apex'],
	['java', 'java'],
	['javascript', 'javascript'],
	['ecmascript', 'javascript'],
	['js', 'javascript'],
	['jsp', 'jsp'],
	['modelica', 'modelica'],
	['plsql', 'plsql'],
	['pl/sql', 'plsql'],
	['pl-sql', 'plsql'],
	['scala', 'scala'],
	['vf', 'visualforce'],
	['visualforce', 'visualforce'],
	['xml', 'xml'],
	['pom', 'xml'],
	['xsl', 'xml']
]);

export class DefaultJarDeriver {
	public static deriveDefaultPmdJar(lang=''): string {
		if (LANGUAGES_BY_ALIAS.has(lang.toLowerCase())) {
			return path.join(PMD_LIB, `pmd-${LANGUAGES_BY_ALIAS.get(lang.toLowerCase())}-${PMD_VERSION}.jar`);
		} else {
			return '';
		}
	}
}
