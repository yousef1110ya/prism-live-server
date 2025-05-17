const { findPackageJSON } = require('module');
const Stream = require('../models/stream');
const { randomUUID } = require('crypto');




const startStream = async (req , res) => {
    // this line will generate a key that looks like this 
    // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb9b'
    const streamKey = randomUUID();
    // getting the server ip from the env (put your device local ip)
    const ip = process.env.SERVER_IP;
    const streamURL = "rtmp://"+ip+"/live/"+streamKey;
    const views =0 ;
    const streamerId = req.streamer.streamerId;
    const streamerName = req.streamer.streamerName;
    const streamerImage = req.streamer.streamerImage;   

    try {
        const oldStream = await Stream.updateMany(
            { streamerId: streamerId, is_active: true }, // filter: active streams of this streamer
            { $set: { is_active: false } }               // update: set is_active to false
          );
    } catch (error) {
        
        return res.status(400).json({
            message: 'error while de avtivating the previos streams',
            error: error.message,
          });
    }



    try {
        const newStream = await Stream.create({
            streamerName,
            streamerImage,
            streamerId,
            views,
            streamKey,
            streamURL,
            // is_active will default to true
          });
          return res.status(201).json({
            message: 'Stream created successfully',
            stream: newStream,
          });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to create stream',
            error: error.message,
          });
    }

    
};

const endStream = async (req, res) => {
  const { streamKey } = req.params;

  try {
    const stream = await Stream.findOne({ streamKey: streamKey });

    if (!stream) {
      return res.status(404).json({
        message: 'Stream not found',
      });
    }

    if (stream.streamerId !== req.streamer.streamerId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    stream.is_active = false;
    await stream.save();

    return res.status(200).json({
      message: 'Stream ended successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getStreams = async (req , res) => {
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 15; // Default to 15 items per page
  const skip = (page - 1) * limit;

  try {
    const query = { is_active: true };

    // Fetch paginated streams and total count
    const [streams, total] = await Promise.all([
      Stream.find(query).skip(skip).limit(limit),
      Stream.countDocuments(query),
    ]);

    const lastPage = Math.ceil(total / limit);
    const from = total === 0 ? null : skip + 1;
    const to = skip + streams.length;

    // Helper function to construct page URLs
    const constructPageUrl = (pageNumber) => {
      return `${process.env.BASE_URL}${req.baseUrl}${req.path}?page=${pageNumber}&limit=${limit}`;
    };

    // Construct pagination URLs
    const firstPageUrl = constructPageUrl(1);
    const lastPageUrl = constructPageUrl(lastPage);
    const nextPageUrl = page < lastPage ? constructPageUrl(page + 1) : null;
    const prevPageUrl = page > 1 ? constructPageUrl(page - 1) : null;

    res.status(200).json({
      current_page: page,
      data: streams,
      first_page_url: firstPageUrl,
      from: from,
      last_page: lastPage,
      last_page_url: lastPageUrl,
      next_page_url: nextPageUrl,
      path: `${process.env.BASE_URL}${req.baseUrl}${req.path}`,
      per_page: limit,
      prev_page_url: prevPageUrl,
      to: to,
      total: total,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const updateViews = async (req , res) => {
    
};

module.exports = {startStream , endStream , getStreams , updateViews};