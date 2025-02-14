/* ------------------------ getfirebase data with ref ----------------------- */

const unsub = onSnapshot(collection(db, "products"), async (snapShot) => {
    const productsWithCategory = await Promise.all(
        snapShot.docs.map(async (docSnapshot) => {
        const productData = docSnapshot.data();
        const categoryRef = productData.category;
    
        // Fetch the referenced category document
        let categoryData = null;
        if (categoryRef) {
            const categoryDoc = await getDoc(categoryRef);
            if (categoryDoc.exists()) {
            categoryData = categoryDoc.data();
            }
        }
    
        // Combine product data with its category data
        return {
            id: docSnapshot.id,
            ...productData,
            category: categoryData, // Replace the reference with actual category data
        };
        })
    );
    console.log(productsWithCategory);
})