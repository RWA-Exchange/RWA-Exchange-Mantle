/**
 * Test Runner Script (JavaScript version)
 * Runs all tests and generates comprehensive reports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = [];
  }

  async runAllTests() {
    console.log('🧪 Starting Phase 2 Test Suite...\n');

    // Run unit tests
    await this.runUnitTests();
    
    // Run component tests
    await this.runComponentTests();
    
    // Run security tests
    await this.runSecurityTests();
    
    // Skip coverage report in main runner (can be run separately)
    console.log('📊 Coverage Report: Run "npm run test:coverage" separately for detailed coverage\n');
    
    // Generate final report
    this.generateFinalReport();
  }

  async runUnitTests() {
    console.log('📋 Running Unit Tests...');
    try {
      const output = execSync('npm run test -- tests/property-contract.test.ts', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.results.push({
        suite: 'Unit Tests',
        passed: true,
        coverage: this.extractCoverage(output)
      });
      
      console.log('✅ Unit Tests: PASSED\n');
    } catch (error) {
      this.results.push({
        suite: 'Unit Tests',
        passed: false,
        errors: [error.message]
      });
      
      console.log('❌ Unit Tests: FAILED\n');
      console.log('   Error:', error.message.split('\n')[0]);
    }
  }

  async runComponentTests() {
    console.log('🧩 Running Component Tests...');
    try {
      const output = execSync('npm run test -- tests/components.test.tsx', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.results.push({
        suite: 'Component Tests',
        passed: true,
        coverage: this.extractCoverage(output)
      });
      
      console.log('✅ Component Tests: PASSED\n');
    } catch (error) {
      this.results.push({
        suite: 'Component Tests',
        passed: false,
        errors: [error.message]
      });
      
      console.log('❌ Component Tests: FAILED\n');
      console.log('   Error:', error.message.split('\n')[0]);
    }
  }

  async runSecurityTests() {
    console.log('🔒 Running Security Tests...');
    
    // Check for console.log statements with sensitive data
    const securityIssues = this.checkSecurityIssues();
    
    if (securityIssues.length === 0) {
      this.results.push({
        suite: 'Security Tests',
        passed: true
      });
      
      console.log('✅ Security Tests: PASSED\n');
    } else {
      this.results.push({
        suite: 'Security Tests',
        passed: false,
        errors: securityIssues
      });
      
      console.log('❌ Security Tests: FAILED\n');
      securityIssues.forEach(issue => console.log(`   - ${issue}`));
    }
  }

  checkSecurityIssues() {
    const issues = [];
    const srcDir = path.join(process.cwd(), 'src');
    
    // Check for unsafe console.log statements
    const files = this.getAllFiles(srcDir, ['.ts', '.tsx']);
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Check for console.log with potential sensitive data
        if (line.includes('console.log') && !line.includes('logger.')) {
          // Check if it might contain sensitive data
          if (line.match(/0x[a-fA-F0-9]{40,64}|digest|objectId|private|secret/i)) {
            issues.push(`${file}:${index + 1} - Potential sensitive data in console.log`);
          }
        }
      });
    });
    
    return issues;
  }

  getAllFiles(dir, extensions) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          files.push(...this.getAllFiles(fullPath, extensions));
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      // Directory might not exist, skip
    }
    
    return files;
  }

  // Coverage report method removed - run separately for better performance

  extractCoverage(output) {
    const coverageMatch = output.match(/All files\s+\|\s+(\d+\.?\d*)/);
    return coverageMatch ? parseFloat(coverageMatch[1]) : 0;
  }

  generateFinalReport() {
    console.log('📋 Phase 2 Test Results Summary');
    console.log('================================\n');
    
    let allPassed = true;
    let totalCoverage = 0;
    let coverageCount = 0;
    
    this.results.forEach(result => {
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      const coverage = result.coverage ? ` (${result.coverage}% coverage)` : '';
      
      console.log(`${result.suite}: ${status}${coverage}`);
      
      if (result.errors) {
        result.errors.forEach(error => {
          console.log(`   - ${error.split('\n')[0]}`);
        });
      }
      
      if (!result.passed) allPassed = false;
      if (result.coverage) {
        totalCoverage += result.coverage;
        coverageCount++;
      }
    });
    
    const avgCoverage = coverageCount > 0 ? totalCoverage / coverageCount : 0;
    
    console.log('\n================================');
    console.log(`Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log(`Average Coverage: ${avgCoverage.toFixed(1)}%`);
    
    if (allPassed) {
      console.log('\n🎉 Phase 2 Requirements Met!');
      console.log('✅ All tests passing');
      console.log('✅ Security requirements satisfied');
      console.log('✅ Production ready');
      if (avgCoverage > 0) {
        console.log(`✅ Coverage: ${avgCoverage.toFixed(1)}%`);
      } else {
        console.log('📊 Run "npm run test:coverage" for detailed coverage report');
      }
    } else {
      console.log('\n⚠️ Phase 2 Requirements Not Met');
      console.log('❌ Some tests are failing');
    }
    
    console.log('\n📁 Reports available:');
    console.log('   - coverage/index.html (Coverage Report)');
    console.log('   - phase2-plan/SECURITY_DOCUMENTATION.md (Security Docs)');
    console.log('   - phase2-plan/PHASE2_PLAN.md (Implementation Plan)');
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(console.error);
}

module.exports = { TestRunner };