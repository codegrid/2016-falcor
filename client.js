var model = new falcor.Model({
  cache: {
    answer: 42
  }
});

model.get('answer').then(function(res) {
  console.log(res);　// => 42
});
