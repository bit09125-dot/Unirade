app.post("/activate-premnium",  async (req, res) => {
  const { userId } = req.body;

  const premiumDate = new Date();

premiumDate.setMonth(premiumDate.getMonth() + 1);

  await Users.updateOne(
    { _id: userId },
    {
      isPremium: true,
      premiumUntil: premiumDate
    }
  );

  rs.json({
    message: "Premium activated"
  });
});
