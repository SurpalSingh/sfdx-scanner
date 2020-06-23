import {expect} from 'chai';
import Sinon = require('sinon');
import {before} from 'mocha';
import {Config} from '../../../src/lib/util/Config';
import {PmdCatalogWrapper} from '../../../src/lib/pmd/PmdCatalogWrapper';
import {PmdEngine} from '../../../src/lib/pmd/PmdEngine';
import {PMD_LIB, PMD_VERSION} from '../../../src/lib/pmd/PmdSupport';
import path = require('path');

class TestablePmdCatalogWrapper extends PmdCatalogWrapper {
	public async buildCommandArray(): Promise<[string, string[]]> {
		return super.buildCommandArray();
	}
}

describe('PmdCatalogWrapper', () => {
	describe('protected async buildCommandArray()', () => {
		describe('When Config.json DOES specify active languages', () => {
			const withDefaultLangs = {
				name: "pmd",
				// Pretend that the config specifies three languages, one of which is not enabled by default.
				supportedLanguages: ['apex', 'javascript', 'java'],
				targetPatterns: [
					"**/*.cls","**/*.java","**/*.js","**/*.page","**/*.component","**/*.xml",
					"!**/node_modules/**","!**/*-meta.xml"
				]
			};

			before(() => {
				Sinon.createSandbox();
				// Make the Config file pretend that it specifies 'apex, 'javascript', and 'java'.
				Sinon.stub(Config.prototype, 'getEngineConfig').withArgs(PmdEngine.NAME).returns(withDefaultLangs);
			});

			after(() => {
				Sinon.restore();
			});

			it('All specified languages are included in the parameters', async () => {
				const wrapper = await TestablePmdCatalogWrapper.create({});
				const parameters = (await wrapper.buildCommandArray())[1];
				// There should be 7 parameters supplied to the command.
				expect(parameters.length).to.equal(7, 'Should be 7 parameters to the catalog call');
				// We don't really need to test anything about the first four parameters, since they're flags, classpath,
				// main, etc. We do care about the last three parameters, since those are the actual real input.
				expect(parameters[4]).to.match(/^apex=/);
				expect(parameters[4]).to.include(path.join(PMD_LIB, `pmd-apex-${PMD_VERSION}.jar`));
				expect(parameters[5]).to.match(/^javascript=/);
				expect(parameters[5]).to.include(path.join(PMD_LIB, `pmd-javascript-${PMD_VERSION}.jar`));
				expect(parameters[6]).to.match(/^java=/);
				expect(parameters[6]).to.include(path.join(PMD_LIB, `pmd-java-${PMD_VERSION}.jar`));
			});
		});

		describe('When Config.json DOES NOT specify active languages', () => {
			const withoutDefaultLangs = {
				name: "pmd",
				targetPatterns: [
					"**/*.cls","**/*.java","**/*.js","**/*.page","**/*.component","**/*.xml",
					"!**/node_modules/**","!**/*-meta.xml"
				]
			};

			before(() => {
				Sinon.createSandbox();
				// Make the Config file pretend that it specifies no languages.
				Sinon.stub(Config.prototype, 'getEngineConfig').withArgs(PmdEngine.NAME).returns(withoutDefaultLangs);
			});

			after(() => {
				Sinon.restore();
			});

			it('Only the default languages (apex and JS) are included in the parameters', async () => {
				const wrapper = await TestablePmdCatalogWrapper.create({});
				const parameters = (await wrapper.buildCommandArray())[1];
				// There should be 6 parameters supplied to the command.
				expect(parameters.length).to.equal(6, 'Should be 6 parameters to the catalog call');
				// We don't really need to test anything about the first four parameters, since they're flags, classpath,
				// main, etc. We do care about the last three parameters, since those are the actual real input.
				expect(parameters[4]).to.match(/^apex=/);
				expect(parameters[4]).to.include(path.join(PMD_LIB, `pmd-apex-${PMD_VERSION}.jar`));
				expect(parameters[5]).to.match(/^javascript=/);
				expect(parameters[5]).to.include(path.join(PMD_LIB, `pmd-javascript-${PMD_VERSION}.jar`));
			});
		});
	});
});
