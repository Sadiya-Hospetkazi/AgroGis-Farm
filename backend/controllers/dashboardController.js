exports.getDashboard = (req, res) => {
  res.json({
    user: {
      id: req.userId,
      name: "Demo User",
      email: "demo@test.com"
    },
    scores: [
      { label: "Crop Health", value: 82 },
      { label: "Soil Quality", value: 76 }
    ]
  });
};