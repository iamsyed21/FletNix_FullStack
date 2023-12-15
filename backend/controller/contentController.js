import Content from '../models/content.js';
import User from '../models/users.js';


// Admin create content
export const createContent = async (req, res) => {
  const { show_id, type, title, 
    director, cast, country, date_added, 
    release_year, rating, duration, category, 
    description, banner_picture_url, title_url } = req.body;

  try {
    const content = new Content({
      show_id,
      type,
      title,
      director,
      cast,
      country,
      date_added,
      release_year,
      rating,
      duration,
      category,
      description,
      banner_picture_url,
      title_url
    });

    const createdContent = await content.save();
    res.status(201).json(createdContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateContent = async (req, res) => {
  const { id } = req.params;
  const { type, title, director, 
    cast, country, date_added, release_year, 
    rating, duration, category, description, 
    banner_picture_url, title_url } = req.body;

  try {
    const content = await Content.findById(id);

    if (!content) {
      res.status(404);
      throw new Error('Content not found');
    }

    
    content.type = type;
    content.title = title;
    content.director = director;
    content.cast = cast;
    content.country = country;
    content.date_added = date_added;
    content.release_year = release_year;
    content.rating = rating;
    content.duration = duration;
    content.category = category;
    content.description = description;
    content.banner_picture_url = banner_picture_url;
    content.title_url = title_url;

    const updatedContent = await content.save();
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    const content = await Content.findById(id);

    if (!content) {
      res.status(404);
      throw new Error('Content not found');
    }

    await content.remove();
    res.status(200).json({ message: 'Content removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getContent = async (req, res) => {
    const { profileId, type, category, page = 1, limit = 15 } = req.query;

    try {
        const user = await User.findOne({ 'profiles._id': profileId });
        if (!user) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const profile = user.profiles.id(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        
        let query = {};
        if (type) query.type = type;
        if (category) query.category = { $in: [category] };

        
        const shouldPaginate = page !== undefined && limit !== undefined;
        const contentQuery = Content.find(query);
        if (shouldPaginate) {
            contentQuery.limit(parseInt(limit)).skip(parseInt(limit) * (page - 1));
        }

        
        const contentItems = await contentQuery;
        const ageRestricted = profile.age < 18;
        const filteredContent = contentItems.filter(item => !ageRestricted || item.rating !== 'R');

        res.json(filteredContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategoriesByType = async (req, res) => {
  const { type } = req.query; 

  try {
      const contentItems = await Content.find({ type: type });
      let categories = new Set();

      contentItems.forEach(item => {
          item.category.forEach(category => categories.add(category));
      });

      res.json([...categories]);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const searchContent = async (req, res) => {
  const { profileId, search, page = 1, limit = 15 } = req.query;

  try {
    const user = await User.findOne({ 'profiles._id': profileId });
    if (!user) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    const profile = user.profiles.id(profileId);
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    let query = {};
    if (search) {
      
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { cast: { $regex: search, $options: 'i' } }
      ];
    }

    const ageRestricted = profile.age < 18;
    if (ageRestricted) {
        query.rating = { $ne: 'R' };
    }

    const contentItems = await Content.find(query)
                                      .limit(parseInt(limit))
                                      .skip(parseInt(limit) * (page - 1));

    res.json(contentItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
