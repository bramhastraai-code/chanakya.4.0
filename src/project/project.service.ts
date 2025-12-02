import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectAffordability, ProjectCategory } from './enum/project.enum';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PropertyService } from 'src/property/property.service';
import { Status } from 'src/common/enum/status.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,

    private readonly propertyService: PropertyService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
    status?: Status,
  ): Promise<{
    projects: Project[];
    totalPages: number;
    totalProjects: number;
    pageSize: number;
    pageNumber: number;
  }> {
    try {
      const page = parseInt(pageNumber, 10) || 1;
      const size = parseInt(pageSize, 10) || 10;
      const skip = (page - 1) * size;

      const query: any = {};
      if (searchQuery) {
        query.$or = [
          { projectName: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }
      if (status !== 'all') {
        query.status = status;
      }

      const totalProjects = await this.projectModel.countDocuments(query);
      const totalPages = Math.ceil(totalProjects / size);

      const projects = await this.projectModel
        .find(query)
        .skip(skip)
        .limit(size)
        .sort({ [sortBy]: sortOrder ? -1 : -1 })
        .populate({ path: 'builder', strictPopulate: false })
        .populate({ path: 'amenities', strictPopulate: false })
        .populate({ path: 'facilities', strictPopulate: false })
        .populate({ path: 'createdBy', strictPopulate: false })
        .populate({ path: 'updatedBy', strictPopulate: false })
        .exec();

      return {
        projects: projects,
        totalProjects,
        totalPages,
        pageSize: size,
        pageNumber: page,
      };
    } catch (error) {
      throw error;
    }
  }

  async findProjectsByCreator(
    creatorId: string,
    pageSize: string,
    pageNumber: string,
    searchQuery?: string,
    status?: string,
  ): Promise<{
    projects: Project[];
    totalPages: number;
    totalProjects: number;
    pageSize: number;
    pageNumber: number;
  }> {
    try {
      const page = parseInt(pageNumber, 10) || 1;
      const size = parseInt(pageSize, 10) || 10;
      const skip = (page - 1) * size;

      const query: any = { createdBy: creatorId };

      if (searchQuery) {
        query.$or = [
          { projectName: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      const totalProjects = await this.projectModel.countDocuments(query);
      const totalPages = Math.ceil(totalProjects / size);

      const projects = await this.projectModel
        .find(query)
        .skip(skip)
        .limit(size)
        .sort({ createdAt: -1 })
        .populate({ path: 'builder', strictPopulate: false })
        .populate({ path: 'amenities', strictPopulate: false })
        .populate({ path: 'facilities', strictPopulate: false })
        .populate({ path: 'createdBy', strictPopulate: false })
        .populate({ path: 'updatedBy', strictPopulate: false })
        .exec();

      return {
        projects,
        totalProjects,
        totalPages,
        pageSize: size,
        pageNumber: page,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel
      .findById(id)
      .populate({ path: 'builder', strictPopulate: false })
      .populate({ path: 'amenities', strictPopulate: false })
      .populate({ path: 'facilities', strictPopulate: false })
      .populate({ path: 'projectGroup.customer', strictPopulate: false })
      .exec();

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .populate({ path: 'builder', strictPopulate: false })
      .populate({ path: 'amenities', strictPopulate: false })
      .populate({ path: 'facilities', strictPopulate: false })
      .populate({ path: 'createdBy', strictPopulate: false })
      .populate({ path: 'updatedBy', strictPopulate: false })
      .populate({ path: 'executiveUser', strictPopulate: false })
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async remove(_id: string): Promise<any> {
    const result = await this.projectModel.findByIdAndDelete(_id).exec();
    console.log(result);

    if (!result) {
      throw new NotFoundException(`Project with ID ${_id} not found`);
    }
  }

  async ProjectList() {
    const builders = await this.projectModel.find().exec();
    const data = builders.map((project) => ({
      value: project._id, // assuming name is the value you want
      label: project.projectName, // or any other field for the label
    }));
    return data;
  }

  // Endpoints for the website_______________________________________________________________________________

  async getProjectsByCategory(category?: ProjectCategory): Promise<any[]> {
    try {
      const filter = category
        ? { projectCategory: category, status: Status.ACTIVE }
        : { status: Status.ACTIVE };
      const projects = await this.projectModel
        .find(filter)
        .populate({ path: 'builder', strictPopulate: false })
        .populate({ path: 'amenities', strictPopulate: false })
        .populate({ path: 'facilities', strictPopulate: false })
        .populate({ path: 'createdBy', strictPopulate: false })
        .populate({ path: 'updatedBy', strictPopulate: false })
        .populate({ path: 'executiveUser', strictPopulate: false })
        .sort({ featured: -1 })
        .exec();

      if (!projects.length) {
        throw new NotFoundException('No projects found for the given category');
      }
      console.log('getProjectsByCategory', projects[0]._id);

      return projects;
    } catch (error) {
      throw error;
    }
  }
  async getProjectsByAffordability(
    affordability?: ProjectAffordability,
    city?: string,
  ): Promise<any[]> {
    try {
      console.log('affordability controller', city, affordability);

      const filter: any = { status: Status.ACTIVE };
      if (affordability) {
        filter.projectAffordability = affordability;
      }
      if (city) {
        filter.city = { $regex: city, $options: 'i' };
      }

      const projects = await this.projectModel
        .find(filter)
        .populate({ path: 'builder', strictPopulate: false })
        .populate({ path: 'amenities', strictPopulate: false })
        .populate({ path: 'facilities', strictPopulate: false })
        .populate({ path: 'createdBy', strictPopulate: false })
        .populate({ path: 'updatedBy', strictPopulate: false })
        .populate({ path: 'executiveUser', strictPopulate: false })
        .sort({ featured: -1 })
        .exec();
      console.log('getProjectsByAffordability', projects);

      if (!projects.length) {
        throw new NotFoundException('No projects found for the given criteria');
      }

      return projects;
    } catch (error) {
      throw error;
    }
  }

  async getProjectDetail(projectId: string): Promise<any> {
    const project = await this.projectModel
      .findById(projectId)
      .populate({ path: 'builder', strictPopulate: false })
      .populate({ path: 'amenities', strictPopulate: false })
      .populate({ path: 'facilities', strictPopulate: false })
      .populate({ path: 'createdBy', strictPopulate: false })
      .populate({ path: 'updatedBy', strictPopulate: false })
      .populate({ path: 'executiveUser', strictPopulate: false })
      .exec();

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const property = await this.propertyService.getPropertiesByProjectId(
      project._id.toString(),
    );
    console.log('property', project._id, property);

    project.properties = property;
    return {
      project,
    };
  }

  async getProjectsByCity(city: string): Promise<Project[]> {
    const projects = await this.projectModel
      .find({ city, status: Status.ACTIVE })
      .populate({ path: 'builder', strictPopulate: false })
      .populate({ path: 'amenities', strictPopulate: false })
      .populate({ path: 'facilities', strictPopulate: false })
      .populate({ path: 'createdBy', strictPopulate: false })
      .populate({ path: 'updatedBy', strictPopulate: false })
      .populate({ path: 'executiveUser', strictPopulate: false })
      .sort({ featured: -1 })
      .exec();

    // If no projects are found, return an empty array
    if (!projects.length) {
      console.log(`No active projects found in city: ${city}`);
      return [];
    }
    return projects;
  }

  async getFormattedProjects(): Promise<any[]> {
    try {
      const projects = await this.projectModel
        .aggregate([
          // Step 1: Filter active projects
          {
            $match: {
              status: Status.ACTIVE, // Only include active projects
            },
          },
          // Step 2: Group projects by city and region
          {
            $group: {
              _id: {
                city: '$city',
                region: '$region',
              },
              projects: {
                $push: {
                  _id: '$_id',
                  name: '$projectName',
                  imageURL: { $arrayElemAt: ['$images', 0] }, // First image as thumbnail
                  description: '$description',
                  featured: '$featured', // Include featured status for sorting
                },
              },
            },
          },
          // Step 3: Sort projects by featured status within each region
          {
            $project: {
              _id: 1,
              city: '$_id.city',
              region: '$_id.region',
              projects: {
                $sortArray: { input: '$projects', sortBy: { featured: -1 } },
              },
            },
          },
          // Step 4: Group regions under their respective cities
          {
            $group: {
              _id: '$city',
              regions: {
                $push: {
                  regionName: '$region',
                  projects: '$projects',
                },
              },
            },
          },
          // Step 5: Final projection to format the response
          {
            $project: {
              city: '$_id',
              regions: 1,
              _id: 0,
            },
          },
        ])
        .exec();

      // Transform aggregated data to required DTO format
      return projects.map((city) => ({
        city: city.city,
        regions: city.regions.map((region: any) => ({
          regionName: region.regionName,
          regionImage: region.projects[0]?.imageURL || '', // Use the first project's image as the region's image
          projects: region.projects.map((project: any) => ({
            projectId: project._id,
            name: project.name,
            imageURL: project.imageURL,
            description: project.description,
          })),
        })),
      }));
    } catch (error) {
      console.error('Error in getFormattedProjects:', error.message);
      throw error;
    }
  }
  async getUniqueCities(): Promise<string[]> {
    try {
      const cities = await this.projectModel.distinct('city').exec();
      return cities;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving unique cities.',
      );
    }
  }
  async getCityPropertyCount() {
    // MongoDB Aggregation Pipeline to group by city and count properties
    const result = await this.projectModel.aggregate([
      { $match: { status: 'active' } }, // Only count active projects (optional)
      {
        $group: {
          _id: '$city', // Group by city field
          propertyCount: { $sum: 1 }, // Count the number of properties
        },
      },
      { $sort: { propertyCount: -1 } }, // Sort by count (descending)
    ]);

    // Format response for better readability
    return result.map((item) => ({
      city: item._id,
      propertyCount: item.propertyCount,
    }));
  }
  async getProjectsByBuilder(builderId: string) {
    const projects = await this.projectModel
      .find({ builder: builderId })
      .populate({ path: 'builder', strictPopulate: false })
      .populate({ path: 'amenities', strictPopulate: false })
      .populate({ path: 'facilities', strictPopulate: false })
      .populate({ path: 'createdBy', strictPopulate: false })
      .populate({ path: 'updatedBy', strictPopulate: false })
      .populate({ path: 'executiveUser', strictPopulate: false })
      .exec();

    if (!projects.length) {
      throw new NotFoundException('No projects found for this builder');
    }

    return { data: projects, message: 'builder projects fetched successfully' };
  }
  async getProjectsGroupedByBuilder() {
    const data = await this.projectModel.aggregate([
      // Lookup to join the 'builders' collection
      {
        $lookup: {
          from: 'builders', // Name of the 'Builder' collection
          localField: 'builder', // Field in the Project schema referencing the Builder
          foreignField: '_id', // Primary key in the Builder collection
          as: 'builderInfo', // Resulting field to store builder data
        },
      },
      // Unwind the builderInfo array to make it a single object
      {
        $unwind: '$builderInfo',
      },
      // Group projects by builder
      {
        $group: {
          _id: '$builder', // Group by builder ID
          builderName: { $first: '$builderInfo.name' }, // Use builder's name
          builderEmail: { $first: '$builderInfo.email' }, // Example of additional field
          projects: {
            $push: {
              _id: '$_id',
              projectName: '$projectName',
              description: '$description',
              priceMin: '$priceMin',
              priceMax: '$priceMax',
              city: '$city',
              state: '$state',
              status: '$status',
              thumbnail: '$thumbnail',
            },
          },
        },
      },
      // Project the desired output structure
      {
        $project: {
          _id: 0, // Exclude default MongoDB `_id`
          builderId: '$_id', // Alias for builder ID
          builderName: 1,
          builderEmail: 1, // Example additional field
          projects: 1,
        },
      },
    ]);

    console.log('data', data);
    return { data, message: 'Builder Projects Fetched Successfully' };
  }

  async getProjectsByKeyword(keyword: string): Promise<Project[]> {
    try {
      const projects = await this.projectModel
        .find({
          $or: [
            { projectName: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
          status: Status.ACTIVE,
        })
        .populate({ path: 'builder', strictPopulate: false })
        .populate({ path: 'amenities', strictPopulate: false })
        .populate({ path: 'facilities', strictPopulate: false })
        .populate({ path: 'createdBy', strictPopulate: false })
        .populate({ path: 'updatedBy', strictPopulate: false })
        .populate({ path: 'executiveUser', strictPopulate: false })
        .exec();

      if (!projects.length) {
        throw new NotFoundException('No projects found for the given keyword');
      }

      return projects;
    } catch (error) {
      throw error;
    }
  }

  async searchProjects(
    keyword: string,
  ): Promise<{ id: string; title: string }[]> {
    const results = await this.projectModel
      .find(
        { $text: { $search: keyword } }, // Mongoose text search
        { projectName: 1, _id: 1 }, // Include only `projectName` and `_id`
      )
      .exec();

    // Format the results
    return results.map((project) => ({
      id: project._id.toString(),
      title: project.projectName,
    }));
  }
  // Endpoints for the builder_______________________________________________________________________________
  /**
 builder specific methods
 *  
 */
  async getBuilderProjects(builderId: string): Promise<Project[]> {
    const projects = await this.projectModel
      .find({ builder: builderId, status: Status.ACTIVE })
      .populate({ path: 'builder', strictPopulate: false })
      .populate({ path: 'amenities', strictPopulate: false })
      .populate({ path: 'facilities', strictPopulate: false })
      .populate({ path: 'createdBy', strictPopulate: false })
      .populate({ path: 'updatedBy', strictPopulate: false })
      .populate({ path: 'executiveUser', strictPopulate: false })
      .exec();

    if (!projects.length) {
      throw new NotFoundException('No active projects found for this builder');
    }

    return projects;
  }
}
