const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const apiEndpoint = 'https://backstage.domain.com/api/user';
const headers = {
  'Content-Type': 'application/json',
  'Cookie': "Cookie_id",
};

// API Clients
async function makeDeleteUserIdRequest(userId, headers) {
   try {
    const response = await axios.delete(`${apiEndpoint}?userId=${encodeURIComponent(userId)}`, {
      headers: {
        ...headers,
      },
    });
    
    return response.status;
  } catch (error) {
    return error.response.status;
  }
}

// Make API Request
async function makeGetUserIdRequest(userId, headers) {
  try {
    const response = await axios.get(`${apiEndpoint}/search?term=${encodeURIComponent(userId)}`, {
      headers: {
        ...headers,
      },
    });
  
    return response.status;
  } catch (error) {
    return error.response.status;
  }
}

// Delete UserID and check status
async function deleteUserIdAndCheck(userId, headers) {
  await makeDeleteUserIdRequest(userId, headers);
  const getUserId = await makeGetUserIdRequest(userId, headers);
  const executionResult = [];

  if (getUserId === 404) {
    executionResult.push([userId, 'deleted'])
  } else {
    executionResult.push([userId, 'unknown'])
  }

  // RESULT
  console.log('executionResult');
  console.log(executionResult);
}

// Confirm deletion
async function main() {
  console.log('Fichier CSV: ' + JSON.stringify(csvFile));

  for (const csvRow of csvFile) {
    const userId = csvRow['userId'];

    if (!userId) {
      throw new Error('No userid found for this line');
    }

    console.log(`Traitement de la ligne: ${JSON.stringify(csvRow)}`);

    await deleteUserIdAndCheck(userId, headers);
  }

}

// Processing CSV File
const csvFile = [];

fs.createReadStream('SRC/list.csv')
  .pipe(csv())
  .on('data', (row) => {
    csvFile.push(row);
  })
  .on('end', async () => {
    console.log('Lecture du fichier CSV terminé.');
    await main();
  });