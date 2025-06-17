export const handleMergeDuplicates = (allocations: string): string => {
    const transactions = allocations
        .trim()
        .split('\n')
        .map((line) => {
            const [addr, amount] = line.split(',');
            return { address: addr, amount: +amount };
        });

    const combinedTransactionsMap: Map<string, number> = new Map();

    // Iterate over transactions array to combine transactions
    transactions.forEach((transaction) => {
        const { address, amount } = transaction;
        if (combinedTransactionsMap.has(address)) {
            // If address already exists, add amount to existing amount
            const existingAmount = combinedTransactionsMap.get(address)!;
            combinedTransactionsMap.set(address, existingAmount + amount);
        } else {
            // If address doesn't exist, set amount for address
            combinedTransactionsMap.set(address, amount);
        }
    });

    // Convert map back to array of transactions
    const combinedTransactions: { address: string; amount: number }[] = [];
    combinedTransactionsMap.forEach((amount, address) => {
        combinedTransactions.push({ address, amount });
    });

    return combinedTransactions.map((x) => `${x.address},${x.amount}`).join('\n');
};

export const handleRemoveDuplicates = (allocations: string): string => {
    const seen: { [key: string]: boolean } = {};
    const result: { address: string; amount: number }[] = [];

    const data = allocations
        .trim()
        .split('\n')
        .map((line) => {
            const [addr, amount] = line.split(',');
            return { address: addr, amount: +amount };
        });

    for (const e of data) {
        if (!seen[e.address]) {
            seen[e.address] = true;
            result.push(e);
        }
    }

    return result.map((x) => `${x.address},${x.amount}`).join('\n');
};
