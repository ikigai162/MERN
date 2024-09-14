import PostModel from "../models/post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Nu s-au putut prelua postările",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags); // Returnează doar tag-urile, nu postările
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Nu s-au putut prelua tag-urile",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    // Actualizează postarea și folosește async/await
    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }, // Incrementare viewsCount cu 1
      },
      {
        returnDocument: "after", // Returnează documentul după actualizare
      }
    ).populate("user");

    // Verifică dacă postarea există
    if (!doc) {
      return res.status(404).json({
        message: "Postarea nu exista",
      });
    }

    // Returnează postarea actualizată
    res.json(doc);
  } catch (err) {
    console.log(err);

    // Returnează o eroare dacă ceva nu merge bine
    res.status(500).json({
      message: "Postarea nu a fost găsită",
    });
  }
};

export const create = async (req, res) => {
  try {
    console.log(req.body);

    // Poți adăuga validări suplimentare pentru câmpuri, dacă este nevoie

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Nu s-a putut crea postarea",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    // Folosește async/await fără callback
    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: "Nu am găsit postarea",
      });
    }

    res.json({
      succes: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Nu am reușit să ștergem postarea",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(","),
        user: req.userId,
      }
    );

    // Trimiți răspunsul succes după ce se face actualizarea
    res.json({
      succes: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Nu s-a reusit sa se modifice postarea",
    });
  }
};
